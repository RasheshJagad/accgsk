export interface IPropertyPaneRichtextProps {
    key: string;
    label: string;
    oldText: string;
    onPropertyChange: (propertyPath: string, newValue: string) => void;
}