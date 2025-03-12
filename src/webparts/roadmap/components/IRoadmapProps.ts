import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRoadmapProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  roadmapTitle: string;
  roadmapDescription: string;
}
