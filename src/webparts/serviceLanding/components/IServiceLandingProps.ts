import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IServiceLandingProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  SiteDescription: string;
  ServiceProperty: string;
  context: WebPartContext;
  // WhatWeDo: string;
  // WhatWeDoDescription: string;
  // WhatWeDoImage: string;
  // WhyWeDo: string;
  // ImportanceDescription: string;
  // OurTeamDescription: string;
  // OurTeamDetailsLibLocation: string;
  PageName:string;
  //ImportanceImage:string;
}
