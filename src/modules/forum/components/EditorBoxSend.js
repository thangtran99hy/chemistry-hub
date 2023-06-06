import React, {useContext} from "react";
import ReactQuill from "react-quill";
import {Button} from "antd";
import {AiOutlineSend} from "react-icons/ai";
import {GrClose} from "react-icons/gr";
import {AuthContext} from "../../../providers/AuthProvider";

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    ]
};

const formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote'
];
const EditorBoxSend = (props) => {
    const {
        value,
        onChange,
        onSubmit,
        isSmall,
        onCancel
    } = props;
    const { authUser, dataUser,
        setIsAuthModal } = useContext(AuthContext);
    return (
        <div className={`EditorBoxSendContainer border border-gray-400 rounded-xl relative ${isSmall ? 'isSmall' : ''}`}>
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
            {typeof onCancel === 'function' && <Button className="absolute right-1 top-1 border-none" onClick={() => {
                onCancel();
            }}  shape="circle" icon={<GrClose />} />}
            <Button className="absolute right-1 bottom-1 border-none" onClick={() => {
                if (!dataUser || !authUser) {
                    setIsAuthModal(true)
                    return;
                }
                onSubmit();
            }}  shape="circle" icon={<AiOutlineSend />} />
        </div>
    )
}

export default EditorBoxSend;