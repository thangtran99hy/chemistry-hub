import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Upload, Button, notification, Select } from "antd";
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
    query,
    getDocs,
    orderBy,
    updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../../../providers/AuthProvider";
import { DRIVE_DIR } from "../../../../../utils/constants";
const { Option } = Select;

const FormDocs = (props) => {
    const { onForceUpdate, folderActive, data } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();
    const [folders, setFolders] = useState(null);

    const getFolders = async () => {
        const db = getFirestore();
        const q = query(
            collection(db, "docFolders"),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        let items = [];
        querySnapshot.forEach((doc, index) => {
            items = [
                ...items,
                {
                    id: doc.id,
                    ...doc.data(),
                },
            ];
        });
        setFolders(items);
    };
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                title: data.title,
                description: data.description,
                folder: data.folder,
            });
        } else {
            form.setFieldsValue({
                folder: folderActive,
            });
        }
        getFolders();
    }, []);

    const onFinish = async (values) => {
        const { file, title, description, folder } = values;
        // console.log("file", file);
        // return;
        const db = getFirestore();

        if (!file?.file) {
            updateDoc(doc(db, "docs", data.id), {
                title,
                description: description ?? "",
                folder: folder ?? null,
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
            return;
        }

        const resUpload = await uploadFile(file?.file);
        if (resUpload.status === "success") {
            try {
                if (data) {
                    updateDoc(doc(db, "docs", data.id), {
                        title,
                        description: description ?? "",
                        docPath: resUpload.docPath,
                        folder: folder ?? null,
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
                    return;
                }
                setDoc(doc(db, "docs", resUpload.docId), {
                    uid: authUser.uid,
                    firstName: dataUser.firstName,
                    lastName: dataUser.lastName,
                    title,
                    description: description ?? "",
                    timestamp: serverTimestamp(),
                    docPath: resUpload.docPath,
                    folder: folder ?? null,
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
                console.log("file", file);
                const docId = uuidv4();
                const storage = getStorage();
                const docPath = `${DRIVE_DIR}/${docId}.${getFileExtension(
                    file.name
                )}`;
                const storageRef = ref(storage, docPath);

                uploadBytes(storageRef, file.originFileObj)
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
                {folders && (
                    <Form.Item label="Select Option" name="folder">
                        <Select>
                            <Option value={null}>Main</Option>
                            {folders.map((item) => {
                                return (
                                    <Option value={item.id}>{item.name}</Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                )}
                <Form.Item
                    name="file"
                    label="Upload File"
                    rules={
                        data
                            ? undefined
                            : [
                                  {
                                      required: true,
                                      message: "Please upload a file",
                                  },
                              ]
                    }
                >
                    <Upload.Dragger
                        maxCount={1}
                        accept=".pdf,.doc,.docx,.ppt,.xls,.xlsx"
                    >
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

export default FormDocs;
