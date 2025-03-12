import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-property-pane';
import { IPropertyPaneRichtextProps } from './IPropertyPaneRichtextProps';
import { IPropertyPaneRichtextInternalProps } from './IPropertyPaneRichtextInternalProps';
import Richtext from './Richtext';
import { IRichtextProps } from './IRichtextProps';

export class PropertyPaneRichtext implements IPropertyPaneField<IPropertyPaneRichtextProps> {
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneRichtextInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneRichtextProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.label,
            label: properties.label,
            oldText: properties.oldText,
            onPropertyChange: properties.onPropertyChange,
            onRender: this.onRender.bind(this),
            onDispose: this.onDispose.bind(this)
        };
    }

    public render(): void {
        if (!this.elem) {
            return;
        }

        this.onRender(this.elem);
    }

    private onDispose(element: HTMLElement): void {
        ReactDom.unmountComponentAtNode(element);
    }

    private onRender(elem: HTMLElement): void {
        if (!this.elem) {
            this.elem = elem;
        }
        const element: React.ReactElement<IRichtextProps> = React.createElement(Richtext, {
            key: this.properties.key,
            label: this.properties.label,
            oldText: this.properties.oldText,
            onChanged: this.onChanged.bind(this)
        });
        ReactDom.render(element, elem);
    }

    private onChanged(text: string): void {
        this.properties.onPropertyChange(this.targetProperty, text);
    }
}
