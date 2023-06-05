import React, { useContext, useState } from "react";
import { Form, Input, Upload, Button, notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
    extractVideoId,
    getFileExtension,
} from "../../../../../utils/functions";
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
import YouTube from "react-youtube";

const FormVideo = (props) => {
    const { onForceUpdate, folderActive } = props;
    const [form] = Form.useForm();
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();
    const [youtubeId, setYouTubeId] = useState();
    const onFinish = async (values) => {
        if (!youtubeId) {
            api.warning({
                message: `Link youtube không thỏa mãn!`,
                placement: "topRight",
            });
            return;
        }
        const { file, title, description, linkYoutube } = values;
        const db = getFirestore();
        setDoc(doc(db, "video", uuidv4()), {
            uid: authUser.uid,
            firstName: dataUser.firstName,
            lastName: dataUser.lastName,
            youtubeId,
            title,
            description: description ?? "",
            timestamp: serverTimestamp(),
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
    };
    return (
        <div>
            <div className="text-2xl font-bold mb-1">Thêm mới một tài liệu</div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
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

                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default FormVideo;
