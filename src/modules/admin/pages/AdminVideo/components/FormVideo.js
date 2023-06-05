import React, {useContext, useEffect, useState} from "react";
import {Form, Input, Upload, Button, notification, Select, Checkbox} from "antd";
import { v4 as uuidv4 } from "uuid";
import {
    extractVideoId,
} from "../../../../../utils/functions";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    serverTimestamp, query, orderBy, getDocs, updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../../../providers/AuthProvider";
import YouTube from "react-youtube";
const { Option } = Select;

const FormVideo = (props) => {
    const { onForceUpdate, folderActive, data } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();
    const [youtubeId, setYouTubeId] = useState();
    const [folders, setFolders] = useState(null);
    const getFolders = async () => {
        const db = getFirestore();
        const q = query(
            collection(db, "videoFolders"),
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
                linkYoutube: `https://www.youtube.com/watch?v=${data.youtubeId}`,
                title: data.title,
                description: data.description,
                folder: data.folder,
                isHide: !!data.isHide,
            });
            setYouTubeId(data.youtubeId)
        } else {
            form.setFieldsValue({
                folder: folderActive,
            });
        }
        getFolders();
    }, []);
    const onFinish = async (values) => {
        if (!youtubeId) {
            api.warning({
                message: `Link youtube không thỏa mãn!`,
                placement: "topRight",
            });
            return;
        }
        const { file, title, description, linkYoutube, isHide, folder } = values;
        const db = getFirestore();
        try {
            if (data) {
                updateDoc(doc(db, "video", data.id), {
                    youtubeId,
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
                            message: `Gặp lỗi khi thêm folder!`,
                            placement: "topRight",
                        });
                    });
                return;
            }

            setDoc(doc(db, "video", uuidv4()), {
                uid: authUser.uid,
                firstName: dataUser.firstName,
                lastName: dataUser.lastName,
                youtubeId,
                title,
                description: description ?? "",
                timestamp: serverTimestamp(),
                folder: folder ?? null,
                isHide: !!isHide,
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
                    name="linkYoutube"
                    label="Link youtube"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a link youtube",
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => {
                            console.log(e.target.value);
                            setYouTubeId(extractVideoId(e.target.value));
                        }}
                    />
                </Form.Item>
                <div>
                    {youtubeId && (
                        <>
                            <div>
                                YoutubeId : <span>{youtubeId}</span>
                            </div>
                            <div>
                                <div className="flex flex-col">
                                    <div>Preview</div>
                                    <div className="w-full">
                                        <YouTube videoId={youtubeId} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
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
                <Form.Item name="isHide" valuePropName="checked">
                    <Checkbox>Hide</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default FormVideo;
