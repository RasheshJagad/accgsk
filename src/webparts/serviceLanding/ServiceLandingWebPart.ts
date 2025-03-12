import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
 // PropertyPaneLink,
 // PropertyPaneLabel
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ServiceLandingWebPartStrings';
import ServiceLanding from './components/ServiceLanding';
import { IServiceLandingProps } from './components/IServiceLandingProps';
//import { PropertyPaneRichtext } from '../../controls/PropertyPaneRichtext/PropertyPaneRichtext';
//import { update, get } from '@microsoft/sp-lodash-subset';

export interface IServiceLandingWebPartProps {
  description: string;
  SiteDescription: string;
  ServiceProperty: string;
  // WhatWeDo: string;
  // WhatWeDoDescription: string;
  // WhatWeDoImage: string;
  // OurTeamDescription: string;
  // OurTeamDetailsLibLocation: string;
  PageName:string;
  // WhyWeDo:string;
  // ImportanceDescription:string;
  // ImportanceImage:string;
}

export default class ServiceLandingWebPart extends BaseClientSideWebPart<IServiceLandingWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IServiceLandingProps> = React.createElement(
      ServiceLanding,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        SiteDescription: this.properties.SiteDescription,
        ServiceProperty: this.properties.ServiceProperty,
        PageName:this.properties.PageName
        //WhatWeDo: this.properties.WhatWeDo,
        // WhatWeDoDescription: this.properties.WhatWeDoDescription,
        // WhatWeDoImage: this.properties.WhatWeDoImage,
        // OurTeamDescription: this.properties.OurTeamDescription,
        // OurTeamDetailsLibLocation: this.properties.OurTeamDetailsLibLocation,
        // 
        // WhyWeDo:this.properties.WhyWeDo,
        // ImportanceDescription:this.properties.ImportanceDescription,
        // ImportanceImage:this.properties.ImportanceImage
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // private onRichtextChange(propertyPath: string, newValue: string): void {
  //   const oldValue: string = get(this.properties, propertyPath);
  //   console.log(oldValue);
  //   // store new value in web part properties
  //   update(this.properties, propertyPath, (): string => { return newValue; });
  //   // refresh web part
  //   this.render();
  // }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("PageName", {
                  label: "Page Name",
                  value: this.properties.PageName,
                 
                }),
                PropertyPaneTextField("SiteDescription", {
                  label: "Site Description",
                  value: this.properties.SiteDescription,
                  multiline: true
                }),
                PropertyPaneTextField("ServiceProperty", {
                  label: "Service Property",
                  value: this.properties.ServiceProperty
                }),
                // PropertyPaneTextField("WhatWeDo", {
                //   label: "What We Do",
                //   value: this.properties.WhatWeDo
                // }),
                // PropertyPaneTextField("WhatWeDoImage", {
                //   label: "What We Do Image",
                //   value: this.properties.WhatWeDoImage
                // }),
                // PropertyPaneTextField("OurTeamDescription", {
                //   label: "Our Team Description",
                //   value: this.properties.OurTeamDescription,
                //   multiline: true
                // }),
                // PropertyPaneTextField("WhyWeDo", {
                //   label: "Why We Do(Optional)",
                //   value: this.properties.WhyWeDo,
                  
                // }),
                // PropertyPaneTextField("ImportanceDescription", { 
                //   label: "Importance Description(Optional)",
                //   value: this.properties.ImportanceDescription,
                //   multiline: true
                // }),
                // PropertyPaneTextField("ImportanceImage", {
                //   label: "Importance Image(Optional)",
                //   value: this.properties.ImportanceImage,
                 
                // }),
                // PropertyPaneLink('OurTeamDetailsLibLocation', {
                //   href: `${this.context.pageContext.site.absoluteUrl}/TeamDetails`,
                //   text: 'Click Here add/remove team members',
                //   target: '_blank'
                // }),
                // PropertyPaneLabel('ImageSizeProperty', {
                //   text: 'Please Note: The size of image should be 155px*155px'
                // })
              ]
            },
            // {
            //   groupName: "",
            //   groupFields: [
            //     new PropertyPaneRichtext("WhatWeDoDescription", {
            //       key: "WhatWeDoDescription",
            //       label: "What We Do Description",
            //       oldText: (typeof this.properties.WhatWeDoDescription !== typeof undefined) ? this.properties.WhatWeDoDescription : "" ,
            //       onPropertyChange: this.onRichtextChange.bind(this)
            //     })
            //   ]
            // }
          ]
        } 
      ]
    };
  }
}
