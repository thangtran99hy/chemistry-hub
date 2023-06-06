import React, {useContext, useEffect} from "react";
import { Form, Input, Upload, Button, notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp, updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../../../providers/AuthProvider";

const FormVideoFolder = (props) => {
    const { onForceUpdate, data } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (data) form.setFieldValue("name", data.name);
    }, []);
    const onFinish = async (values) => {
        const { name } = values;
        try {
            const db = getFirestore();
            if (data) {
                updateDoc(doc(db, "videoFolders", data.id), {
                    name,
                })
                    .then((res) => {
                        form.resetFields();
                        onForceUpdate();
                    })
                    .catch((err) => {
                        api.warning({
                            message: `Có lỗi xảy ra!`,
                            placement: "topRight",
                        });
                    });
                return;
            }
            const folderId = uuidv4();
            setDoc(doc(db, "videoFolders", folderId), {
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
                        message: `Có lỗi xảy ra!`,
                        placement: "topRight",
                    });
                });
        } catch (e) {
            api.warning({
                message: `Có lỗi xảy ra!`,
                placement: "topRight",
            });
        }
    };
    return (
        <div>
            <div className="text-2xl font-bold mb-1">
                {data
                    ? "Sửa một thư mục video"
                    : "Thêm mới một thư mục video"}
            </div>
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
                    <Button htmlType="submit">Lưu</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default FormVideoFolder;
