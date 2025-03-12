import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ServiceProductsWebPartStrings';
import ServiceProducts from './components/ServiceProducts';
import { IServiceProductsProps } from './components/IServiceProductsProps';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import "@pnp/sp/content-types";
import { PropertyPaneFieldsSelector } from '../../controls/PropertyPaneFieldsSelector/PropertyPaneFieldsSelector';
import { update, get } from '@microsoft/sp-lodash-subset';

export interface IServiceProductsWebPartProps {
  description: string;
  tileFields: any[];
  dialogFields: any[];
  apiPath: string;
  Pagename:string;
  PageHead:string;
  PageDescription:string;
}

export default class ServiceProductsWebPart extends BaseClientSideWebPart<IServiceProductsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _fields: any[] = [];

  public render(): void {
    const element: React.ReactElement<IServiceProductsProps> = React.createElement(
      ServiceProducts,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,

        tileFields: this.properties.tileFields,
        dialogFields: this.properties.dialogFields,
        apiPath: this.properties.apiPath,
        Pagename:this.properties.Pagename,
        PageHead:this.properties.PageHead,
        PageDescription: this.properties.PageDescription
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.loadColumns();
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }
  private async loadColumns() {
    const sp = spfi().using(SPFx(this.context));
    const allFields = await sp.web.contentTypes.getById('0x0100B5637EA6C46B4FCBB4CACABD88E6C6EF').fields();
    this._fields.splice(0);
    this._fields.push(...allFields.map(field => ({ key: field.InternalName, text: field.Title })));
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

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private onFieldsSelectorChange(propertyPath: string, newValue: any[]): void {
    const oldValue: any[] = get(this.properties, propertyPath);
    console.log(oldValue);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any[] => { return newValue; });
    // refresh web part
    this.render();
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
              groupName: "",
              groupFields: [
                PropertyPaneTextField("Pagename", {
                  label: "Page Name",
                  value: this.properties.Pagename,
                 
                }),
                PropertyPaneTextField("PageHead", {
                  label: "Page Header",
                  value: this.properties.PageHead
                  
                }),
                PropertyPaneTextField("PageDescription", {
                  label: "Header Description",
                  value: this.properties.PageDescription,
                  multiline: true
                }),
                PropertyPaneTextField('apiPath', {
                  label: "API Path"
                })
              ]
            },
            {
              groupName: "Tile Details",
              groupFields: [
                new PropertyPaneFieldsSelector('tileFields', {
                  key: "tileFields",
                  label: "Select Fields",
                  fields: this._fields,
                  selectedFields: this.properties.tileFields,
                  onPropertyChange: this.onFieldsSelectorChange.bind(this),
                })
              ]
            },
            {
              groupName: "Dialog Details",
              groupFields: [
                new PropertyPaneFieldsSelector('dialogFields', {
                  key: "dialogFields",
                  label: "Select Fields",
                  fields: this._fields,
                  selectedFields: this.properties.dialogFields,
                  onPropertyChange: this.onFieldsSelectorChange.bind(this),
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
