export interface IRichtextProps {
    key: string;
    label: string;
    oldText: string;
    onChanged: (text: string) => void;
}