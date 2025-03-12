import * as React from 'react';
import { IRichtextProps } from './IRichtextProps';
import { Label } from '@fluentui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

const Richtext: React.FunctionComponent<IRichtextProps> = (props: IRichtextProps) => {

    const [text, setText] = React.useState<string>('');

    const rtTextChange = (text: string) => {
        setText(text as string);
        props.onChanged(text as string);
        return text;
    };

    React.useEffect(() => { setText(props.oldText); }, [props.oldText]);

    return (
        <div>
            <div>
                <Label>{props.label}</Label>
            </div>
            <div>
                <div>
                    <ReactQuill
                        theme="snow"
                        value={text}
                        onChange={rtTextChange}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image', 'video'],
                                ['table'],
                                ['clean']
                            ],
                            clipboard: {
                                matchVisual: false,
                            }
                        }}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image', 'video', 'table'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Richtext;