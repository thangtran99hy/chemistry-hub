import React, { useContext } from "react";
import { Form, Input, Upload, Button, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getFileExtension } from "../../../../../utils/functions";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../../../../../providers/AuthProvider";
import { DRIVE_DIR } from "../../../../../utils/constants";

const AddDocsFolder = (props) => {
    const { onForceUpdate } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();

    const onFinish = async (values) => {
        const { name } = values;
        try {
            const db = getFirestore();
            const folderId = uuidv4()
            setDoc(doc(db, "docFolders", folderId), {
                uid: authUser.uid,
                firstName: dataUser.firstName,
                lastName: dataUser.lastName,
                name,
                timestamp: serverTimestamp(),
            })
                .then((res) => {
                    form.resetFields();
                    onForceUpdate();
                })
                .catch((err) => {
                    api.warning({
                        message: `Gặp lỗi khi thêm folder!`,
                        placement: "topRight",
                    });
                });
        } catch (e) {
            api.warning({
                message: `Gặp lỗi khi thêm folder!`,
                placement: "topRight",
            });
        }
    };
    return (
        <div>
            <div className="text-2xl font-bold mb-1">Thêm mới một thư mục tài liệu</div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a name",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default AddDocsFolder;
