import * as React from 'react';
import type { IServiceLinksProps } from './IServiceLinksProps';
import  'jquery';
//import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import styles from './ServiceLinks.module.scss';
 
const ServicesLinks: React.FunctionComponent<IServiceLinksProps> = (props: IServiceLinksProps) => {
 
  // const getServiceNow = async() => {
  //   const url = `https://dev.api.gsk.com/servicenow/api/now/table/kb_knowledge?apikey=Y2JiMjQ2NDktMjA0Zi00YWE1LThiZDUtYjY4OGFhNjVkMmYyGtwUukTvLPtK8C04HCYPHPZcYVgF9rra00NeCAzmiQse&number=KB5186773`;
  //   props.context.httpClient.get(url,HttpClient.configurations.v1).then((response: HttpClientResponse)=> {
  //     console.log("response", response);
  //     console.log("json", response.json());
  //     response.json().then((data) => { console.log("data", data); });
  //   });
  // }
 
  React.useEffect(() => {
   // getServiceNow();
    if (window.location.href.toLowerCase().indexOf('mode=edit') < 0) {
      if ($('div[data-automation-id="CanvasControl"]').length > 0) {
        $.each($('div[data-automation-id="CanvasSection"]'), function (i, ctrl) {
          $.each($(ctrl).find('h2'), function (i, headerCtrl) {
              const aLink = $(headerCtrl).attr('id')//$(ctrl).attr('id');
              const aText = $(headerCtrl).text();
            if (aText !== '') {
              $('#linkbox').append(`<span><a style="border: 0px;text-decoration: none" href="${window.location.href.split('#')[0]}#${aLink}">${aText}</a></span>`);
            }
          }); 
        });     
      }
    }
  });
 
  return (
    <article  className={styles.ourServices}>
       <h3>{props.description || " "}</h3>
      <div id='linkbox' className={styles.serviceSearchResult}>
        
        </div>
      </article>
    
  );
}
 
export default ServicesLinks;