import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-property-pane';
import { IPropertyPaneFieldsSelectorProps } from './IPropertyPaneFieldsSelectorProps';
import { IPropertyPaneFieldsSelectorInternalProps } from './IPropertyPaneFieldsSelectorInternalProps';
import FieldsSelector from './FieldsSelector';
import { IFieldsSelectorProps } from './IFieldsSelectorProps';

export class PropertyPaneFieldsSelector implements IPropertyPaneField<IPropertyPaneFieldsSelectorProps> {
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneFieldsSelectorInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneFieldsSelectorProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.label,
            label: properties.label,
            fields: properties.fields,
            selectedFields: properties.selectedFields,
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
        const element: React.ReactElement<IFieldsSelectorProps> = React.createElement(FieldsSelector, {
            key: this.properties.key,
            label: this.properties.label,
            fields: this.properties.fields,
            selectedFields: this.properties.selectedFields,
            onChanged: this.onChanged.bind(this)
        });
        ReactDom.render(element, elem);
    }

    private onChanged(options: string[]): void {
        this.properties.onPropertyChange(this.targetProperty, options);
    }
}
