
import * as React from 'react';
import { useState, useEffect } from 'react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/search";
import styles from './ServiceLanding.module.scss';
import type { IServiceLandingProps } from './IServiceLandingProps';
import { TextField } from '@fluentui/react';

//import $ from 'jquery';
//import { IHttpClientOptions,HttpClient, HttpClientResponse } from '@microsoft/sp-http';

const ServiceLanding: React.FunctionComponent<IServiceLandingProps> = (props: IServiceLandingProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [showAllTabs, setShowAllTabs] = useState(false);
  //const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [textFieldValue, setTextFieldValue] = React.useState<string>('');
  const iconProps = { iconName: 'SearchArt64' };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const sp = spfi().using(SPFx(props.context));
        const items: any[] = await sp.web.lists.getByTitle('Services')
          .items.select('Title', 'Id', 'ServicePagePath', 'ServicePriority', 'ServiceParent', 'ServiceParent/Title', 'ServiceParent/Id').expand('ServiceParent')  // Select the Priority field
          .orderBy('ServicePriority', true)(); // Sort by Priority in ascending order
        setServices(items);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    // const fetchTeamMembers = async () => {
    //   try {
    //     const sp = spfi().using(SPFx(props.context));
    //     const items: any[] = await sp.web.lists.getByTitle('Team Details')
    //       .items.select('File/ServerRelativeUrl', 'Title', 'MemberDesignation')
    //       .expand('File')();
    //     setTeamMembers(items);
    //   } catch (error) {
    //     console.error('Error fetching team members:', error);
    //   }
    // };

    fetchServices();
    //fetchTeamMembers();
  }, [props.context]);

  useEffect(() => {

    if (textFieldValue.length >= 3) {
      // Call your search function here
      console.log('Searching for:', textFieldValue);
    }
  }, [textFieldValue]);

  // const jQueryLoad = (): void => {
  //   $(function () {

  //   $(`.${styles.subMenuTrigger}`).on('click', (ctrl) => {
  //     var $this = $(ctrl.currentTarget);
  //     $this.closest('li').toggleClass(`${styles.openSubLinks}`);
  //     $this.closest('li').find('ul').slideToggle();
  //     // const currentIcon = $this.text();
  //     // $this.text(currentIcon === '+' ? '-' : '+');
  //   });

  //   // return () => {
  //   //    $(`.${styles.subMenuTrigger}`).off('click');
  //   // }

  // })

  //}

  const handleTabClick = (pageUrl: string) => {
    if (pageUrl) {
      const absoluteUrl = `${window.location.origin}${pageUrl}`;
      console.log(absoluteUrl)
      window.open(absoluteUrl, 'self');
    }
  };

  const onChangeTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

      setTextFieldValue(newValue || '');

    },
    []
  );


  const toggleExpand = (parentServiceName: string) => {
    //jQueryLoad();

    setExpandedParent(expandedParent === parentServiceName ? null : parentServiceName);
  };


  const handleMouseLeave = () => {
    setExpandedParent(null);

  }

  // Show only the first 5 tabs

  const parentServices = services.filter(service => typeof service.ServiceParent === typeof undefined);
  const childServices = services.filter(service => typeof service.ServiceParent !== typeof undefined);

  const visibleTabs = parentServices.slice(0, 5);
  const hiddenTabs = parentServices.slice(5);
  //const baseUrl = window.location.origin;

  return (
    <div>
      <div className={styles.landingCenter}>
        <h2 className={styles.pageHead}>{props.PageName || "No Page Name Provided"}</h2>
        <span className={styles.pageDescr}>
          {props.SiteDescription || "No Site Description Provided"}
        </span>

        <article className={styles.ourServices}>
          <div className='d-flex mb-3 row'>
            <div className='col-md-3'>
              <h3 className='flex-grow-1 mb-2'>{props.ServiceProperty || "No Service Property Provided"}</h3>
            </div>
            <aside className='col-md-9'>
              <TextField className={styles.OurServiceSearch} placeholder='Search for services' iconProps={iconProps} onChange={onChangeTextFieldValue} />
            </aside>
          </div>
          <ul className={styles.roadMapMenuListV2}>
            {services.length > 0 ? textFieldValue.length > 2 ? (
              <div>
                {services.filter(p => JSON.stringify(p).toLocaleLowerCase().indexOf(textFieldValue.toLocaleLowerCase()) >= 0 || textFieldValue === '' || textFieldValue === null || typeof textFieldValue === typeof undefined).map(parent => (
                  <li key={parent.Title} onClick={() => handleTabClick(parent.ServicePagePath)}>
                    <div>
                      <span   >
                        {parent.Title}
                      </span>
                    </div>
                  </li>
                ))}
              </div>) : (
              <div>
                {visibleTabs.map(parent => (
                  <li key={parent.Title} onMouseEnter={() => toggleExpand(parent.Title)} onMouseLeave={handleMouseLeave} className={(childServices.some(child => child.ServiceParent?.Title === parent.Title)) ? styles.hasSublink : " "}>
                    <div onClick={() => { handleTabClick(parent.ServicePagePath); }}>
                      <span>
                        {parent.Title}
                      </span>
                      {childServices.some(child => child.ServiceParent?.Title === parent.Title) && (
                        <i className={styles.subMenuTrigger}>
                          {expandedParent === parent.Title ? '-' : '+'}
                        </i>
                      )}
                    </div>
                    {expandedParent === parent.Title && (
                      <ul>
                        {childServices
                          .filter(child => child.ServiceParent?.Title === parent.Title)
                          .map(child => (
                            <li>
                              <span
                                key={child.Title}
                                onClick={() => handleTabClick(child.ServicePagePath)}
                              >
                                {child.Title}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}

                {hiddenTabs.length > 0 && !showAllTabs && (
                  <span className={styles.more} onClick={() => setShowAllTabs(true)}>
                    + {hiddenTabs.length} More Services
                  </span>
                )}

                {showAllTabs && (
                  <>
                    {hiddenTabs.map(parent => (
                      <li key={parent.Title} onMouseEnter={() => toggleExpand(parent.Title)} onMouseLeave={handleMouseLeave} className={(childServices.some(child => child.ServiceParent?.Title === parent.Title)) ? styles.hasSublink : " "} onClick={() => handleTabClick(parent.ServicePagePath)} >
                        <div>
                          <span  >
                            {parent.Title}
                          </span>

                          {childServices.some(child => child.ServiceParent?.Title === parent.Title) && (
                            <i className={styles.subMenuTrigger} >
                              {expandedParent === parent.Title ? '-' : '+'}
                            </i>
                          )}
                        </div>

                        {expandedParent === parent.Title && (
                          <ul >

                            {childServices
                              .filter(child => child.ServiceParent?.Title === parent.Title)
                              .map(child => (
                                <li>

                                  <span
                                    key={child.Title}
                                    onClick={() => handleTabClick(child.ServicePagePath)}
                                  >
                                    {child.Title}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    <span className={styles.more} onClick={() => setShowAllTabs(false)}>
                      Less
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div>No services available.</div>
            )}


          </ul>
        </article>

        {/* <article className={styles.whatWeDo}>
          <h3>{props.WhatWeDo }</h3>
          <span className={styles.pageDescr}           
             dangerouslySetInnerHTML={{__html:  props.WhatWeDoDescription }}>
          </span>

          {props.WhatWeDoImage ? (
            <img src={props.WhatWeDoImage} alt="Configured Image" style={{ maxWidth: '100%' }} />
          ) : (
           ""
          )}
        </article> */}

        {/* <article className={styles.whyweDo}>
          <h3>{props.WhyWeDo }</h3>
          <span className={styles.pageDescr}>
            {props.ImportanceDescription }
          </span>
          {props.ImportanceImage ? (
            <img src={props.ImportanceImage} alt="Configured Image" style={{ maxWidth: '100%' }} />
          ) : (
           ""
          )}
          
        </article> */}

        {/*    
        <article className={styles.ourteam}>
          <h3>Our Team</h3>
          <span className={styles.pageDescr}>
            {props.OurTeamDescription}
          </span>

          <div className={styles.teamList}>
            {teamMembers.map(member => {
              const imageUrl = `${baseUrl}${member.File.ServerRelativeUrl}`; // Combine base URL with ServerRelativeUrl
              return (
                <aside key={member.Title} className={styles.teamMember}>
                  <figure>
                    <img src={imageUrl} alt={member.Title} style={{ width: '100%' }} />
                  </figure>
                  <strong>{member.Title}</strong>
                  <span>{member.MemberDesignation}</span>
                </aside>
              );
            })}
          </div>
          
        </article>
         <div> 
      <button onClick={callPowerAutomateFlow}>Call Power Automate Flow</button>
    </div> */}
      </div>
    </div>
  );
};

export default ServiceLanding;