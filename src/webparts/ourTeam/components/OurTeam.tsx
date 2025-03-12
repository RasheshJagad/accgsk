import * as React from 'react';
import styles from './OurTeam.module.scss';
import type { IOurTeamProps } from './IOurTeamProps';
import { useState, useEffect } from 'react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/search";


const OurTeam: React.FunctionComponent<IOurTeamProps> = (props: IOurTeamProps) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);


  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const sp = spfi().using(SPFx(props.context));
        const items: any[] = await sp.web.lists.getByTitle('Team Details')
          .items.select('File/ServerRelativeUrl', 'Title', 'MemberDesignation')
          .expand('File')();
        setTeamMembers(items);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, [props.context]);

  const baseUrl = window.location.origin;

  return (
    //Team Section 
    <div >
      <div className={styles.ourteamlandingCenter}>
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
      </div>
    </div>
  )
}



export default OurTeam;
