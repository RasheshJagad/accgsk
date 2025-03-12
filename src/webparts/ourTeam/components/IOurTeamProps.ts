import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IOurTeamProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  OurTeamDescription:string;
  OurTeamDetailsLibLocation: string;
}
