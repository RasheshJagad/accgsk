import * as React from 'react';
import { IFieldsSelectorProps } from './IFieldsSelectorProps';
import { Checkbox, Dropdown, IDropdownOption, Label, List } from '@fluentui/react';
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

const FieldsSelector: React.FunctionComponent<IFieldsSelectorProps> = (props: IFieldsSelectorProps) => {

    // const [_selectedFields, set_SelectedFields] = React.useState<any[]>([]);
    // const [_nonSelectedFields, set_NonSelectedFields] = React.useState<any[]>([]);
    //const [_allFields, set_AllFields] = React.useState<any[]>([]);
    const [listFields, setListFields] = React.useState<any[]>([]);
    const [ddIndex, setDDIndex] = React.useState<IDropdownOption[]>([]);

    React.useEffect(() => {
        const _dIndex: IDropdownOption[] = [...props.fields.map((f, i) => ({ key: i, text: (i + 1).toString() }))];
        setDDIndex(_dIndex);
    }, [props.fields, props.selectedFields]);

    React.useEffect(() => {
        if (typeof props.selectedFields !== typeof undefined) {
            if (props.selectedFields.length > 0) {
                const _listFields: any[] = [...props.selectedFields];
                setListFields(_listFields);
            }
            else {
                const _listFields: any[] = [...props.fields.map((lf, i) => ({ order: i, field: { key: lf.key, text: lf.text, ischecked: false, order: i } }))];
                setListFields(_listFields);
            }
        }
        else {
            const _listFields: any[] = [...props.fields.map((lf, i) => ({ order: i, field: { key: lf.key, text: lf.text, ischecked: false, order: i } }))];
            setListFields(_listFields);
        }
    }, [ddIndex]);

    const onRenderCell = React.useCallback(
        (field: any, index: number | undefined): JSX.Element => {
            return (
                <div className='col-sm-12 col-sx-12'>
                    <div className='row'>
                        <div className='col-sm-8 col-sx-8'>
                            <Checkbox label={`${field.field.text}`}
                                checked={(field.field.ischecked && typeof field.field.ischecked !== typeof undefined)}
                                defaultChecked={(field.field.ischecked && typeof field.field.ischecked !== typeof undefined)}
                                onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) => {
                                    _onCheckboxChange(isChecked as boolean, index as number);
                                }}
                            />
                        </div>
                        <div className='col-sm-4 col-sx-4'>
                            <Dropdown options={ddIndex} defaultSelectedKey={field.field.order} selectedKey={field.field.order}
                                disabled={!field.field.ischecked}
                                onChange={(ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
                                    _onDropdownChange(option as IDropdownOption, field.field.order as number);
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        [listFields, ddIndex]
    );

    const _onCheckboxChange = (isChecked: boolean, index: number) => {
        const _listFields = listFields.filter(l => l.field !== null).map((f, i) => ({ order: i, field: f.field }));
        _listFields[index].field.ischecked = isChecked;
        _listFields.push({ order: 0, field: null });
        console.log(_listFields);
        setListFields(_listFields);
        props.onChanged(_listFields.filter(l => l.field !== null));
    }

    const _onDropdownChange = (option: IDropdownOption, order1: number) => {
        const _listFields = listFields.filter(l => l.field !== null).map((f, i) => ({ order: i, field: f.field }));
        const index1 = _listFields.indexOf(_listFields.filter(lf => lf.field.order === order1)[0]);
        const index2 = _listFields.indexOf(_listFields.filter(lf => lf.field.order === option.key)[0]);
        const value1 = _listFields[index1].field.order;
        const value2 = _listFields[index2].field.order;
        _listFields[index1].field.order = value2;
        _listFields[index2].field.order = value1;
        _listFields.push({ order: 0, field: null });
        setListFields(_listFields);
        props.onChanged(_listFields.filter(l => l.field !== null));
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <Label>{props.label}</Label>
            </div>
            <div className='row'>
                <List items={listFields.filter(l => l.field !== null)} onRenderCell={onRenderCell} />
            </div>
        </div>
    );
}

export default FieldsSelector;