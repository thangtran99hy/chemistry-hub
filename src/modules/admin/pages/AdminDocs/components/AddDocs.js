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

const AddDocs = (props) => {
    const { onForceUpdate, folderActive } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();

    const onFinish = async (values) => {
        const { file, title, description } = values;
        const resUpload = await uploadFile(file?.file);
        if (resUpload.status === "success") {
            try {
                const db = getFirestore();
                console.log(resUpload.docId);
                setDoc(doc(db, "docs", resUpload.docId), {
                    // docId: resUpload.docId,
                    uid: authUser.uid,
                    firstName: dataUser.firstName,
                    lastName: dataUser.lastName,
                    title,
                    description: description ?? "",
                    timestamp: serverTimestamp(),
                    docPath: resUpload.docPath,
                    folder: folderActive,
                })
                    .then((res) => {
                        form.resetFields();
                        onForceUpdate();
                    })
                    .catch((err) => {
                        api.warning({
                            message: `Gặp lỗi khi tải file lên!`,
                            placement: "topRight",
                        });
                    });
            } catch (e) {
                api.warning({
                    message: `Gặp lỗi khi tải file lên!`,
                    placement: "topRight",
                });
            }
        } else {
            api.warning({
                message: `Gặp lỗi khi tải file lên!`,
                placement: "topRight",
            });
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            if (file) {
                const docId = uuidv4();
                const storage = getStorage();
                const docPath = `${DRIVE_DIR}/${docId}.${getFileExtension(
                    file.name
                )}`;
                const storageRef = ref(storage, docPath);

                uploadBytes(storageRef, file)
                    .then((snapshot) => {
                        console.log("Uploaded a blob or file!");
                        resolve({
                            status: "success",
                            docId: docId,
                            docPath: docPath,
                        });
                    })
                    .catch((err) => {
                        resolve({
                            status: "error",
                        });
                    });
            } else {
                resolve({
                    status: "error",
                });
            }
        });
    };
    return (
        <div>
            <div className="text-2xl font-bold mb-1">Thêm mới một tài liệu</div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="file"
                    label="Upload File"
                    rules={[
                        {
                            required: true,
                            message: "Please upload a file",
                        },
                    ]}
                >
                    <Upload.Dragger maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a title",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default AddDocs;
