import React, { useContext, useEffect, useState } from "react";
import {
    Form,
    Input,
    Upload,
    Button,
    notification,
    Select,
    Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {getFileExtension, handleDownload} from "../../../../../utils/functions";
import {
    getFirestore,
    collection,
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
                isHide: !!data.isHide,
            });
        } else {
            form.setFieldsValue({
                folder: folderActive,
            });
        }
        getFolders();
    }, []);

    const onFinish = async (values) => {
        const { file, title, description, folder, isHide } = values;
        const db = getFirestore();

        if (!file?.file) {
            updateDoc(doc(db, "docs", data.id), {
                title,
                description: description ?? "",
                folder: folder ?? null,
                isHide: !!isHide,
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

        const resUpload = await uploadFile(file?.file);
        if (resUpload.status === "success") {
            try {
                if (data) {
                    updateDoc(doc(db, "docs", data.id), {
                        title,
                        description: description ?? "",
                        docPath: resUpload.docPath,
                        folder: folder ?? null,
                        isHide: !!isHide,
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
                setDoc(doc(db, "docs", resUpload.docId), {
                    uid: authUser.uid,
                    firstName: dataUser.firstName,
                    lastName: dataUser.lastName,
                    title,
                    description: description ?? "",
                    timestamp: serverTimestamp(),
                    docPath: resUpload.docPath,
                    folder: folder ?? null,
                    isHide: !!isHide,
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
        } else {
            api.warning({
                message: `Có lỗi xảy ra!`,
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

                uploadBytes(storageRef, file.originFileObj)
                    .then((snapshot) => {
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
    const onDownloadDoc = () => {
        const storage = getStorage();
        getDownloadURL(ref(storage, data.docPath))
            .then((url) => {
                handleDownload(
                    url,
                    `${data.title}.${getFileExtension(data.docPath)}`
                );
            })
            .catch((error) => {});
    }
    return (
        <div>
            <div className="text-2xl font-bold mb-1">
                {data
                    ? "Sửa một tài liệu"
                    : "Thêm mới một tài liệu"}
                </div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {folders && (
                    <Form.Item label="Chọn thư mục" name="folder">
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
                    label="Tải file lên"
                    rules={
                        data
                            ? undefined
                            : [
                                  {
                                      required: true,
                                      message: "Vui lòng tải lên một tập tin",
                                  },
                              ]
                    }
                >
                    {data &&  <Button
                        className="my-1"
                        onClick={() => onDownloadDoc()}
                    >
                        Tải file
                    </Button>}
                    <Upload.Dragger
                        maxCount={1}
                        accept=".pdf,.doc,.docx,.ppt,.xls,.xlsx"
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Nhấp hoặc kéo tệp vào khu vực này để tải lên
                        </p>
                    </Upload.Dragger>
                </Form.Item>



                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[
                        {
                            required: true,
                            message: "vui lòng nhập tiêu đề",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="isHide" valuePropName="checked">
                    <Checkbox>Ẩn</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Lưu</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default FormDocs;
