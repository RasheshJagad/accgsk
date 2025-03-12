export interface IFieldsSelectorProps {
    key: string;
    label: string;
    fields: any[];
    selectedFields: string[];
    onChanged: (option: any[]) => void;
    //onPropertyChange: (propertyPath: string, newValue: any) => void;
}