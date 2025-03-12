import { IDropdownOption } from "@fluentui/react";

export interface IPropertyPaneFieldsSelectorProps {
    key: string;
    label: string;
    fields: IDropdownOption[];
    selectedFields: string[];
    onPropertyChange: (propertyPath: string, newValue: any) => void;
}