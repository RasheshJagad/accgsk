import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IServiceProductsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;

  tileFields: any[];
  dialogFields: any[];
  apiPath: string;
  Pagename:string;
  PageHead:string;
  PageDescription:string;
}
