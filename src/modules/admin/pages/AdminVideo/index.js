import React, { useEffect, useState } from "react";
import AddVideo from "./components/FormVideo";
import ListVideo from "./components/ListVideo";
import { Button, Modal } from "antd";
import AddVideoFolder from "./components/FormVideoFolder";
import { HiFolderAdd } from "react-icons/hi";
import ListVideoFolders from "./components/ListVideoFolders";
const MODAL_ADD_VIDEO = "add_video";
const MODAL_EDIT_VIDEO = "edit_video";
const MODAL_ADD_FOLDER = "add_folder";
const MODAL_EDIT_FOLDER = "edit_folder";
const AdminVideo = (props) => {
    const [modalType, setModalType] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(null);
    const [folderActive, setFolderActive] = useState(null);
    const [folderEditing, setFolderEditing] = useState(null);
    const [videoEditing, setVideoEditing] = useState(null);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(null);
        }
    }, [forceUpdate]);
    return (
        <div className="flex items-start h-full">
            <div className="w-[180px] pr-2 border-r border-r-gray-200 h-full">
                <div className="flex items-center justify-between py-1">
                    <div>Folders</div>
                    <Button
                        icon={<HiFolderAdd />}
                        onClick={() => setModalType(MODAL_ADD_FOLDER)}
                    />
                </div>
                <ListVideoFolders
                    forceUpdate={
                        forceUpdate === MODAL_ADD_FOLDER ||
                        forceUpdate === MODAL_EDIT_FOLDER
                    }
                    onclickFolder={(id) => {
                        setFolderActive(id);
                    }}
                    folderActive={folderActive}
                    onEditFolder={(item) => {
                        setModalType(MODAL_EDIT_FOLDER);
                        setFolderEditing(item);
                    }}
                />
            </div>
            <div className="px-2 flex-1 h-full">
                <Button onClick={() => setModalType(MODAL_ADD_VIDEO)}>
                    Thêm mới video
                </Button>
                <ListVideo
                    forceUpdate={
                        forceUpdate === MODAL_ADD_VIDEO ||
                        forceUpdate === MODAL_EDIT_VIDEO
                    }
                    folderActive={folderActive}
                    onEditDoc={(item) => {
                        setModalType(MODAL_EDIT_VIDEO);
                        setVideoEditing(item);
                    }}
                />
            </div>
            {modalType && (
                <Modal
                    open={!!modalType}
                    onClose={() => {
                        setModalType(null);
                    }}
                    onCancel={() => {
                        setModalType(null);
                    }}
                    footer={null}
                >
                    {modalType === MODAL_ADD_VIDEO ||
                    (modalType === MODAL_EDIT_VIDEO && videoEditing) ? (
                        <AddVideo
                            onForceUpdate={() => {
                                setForceUpdate(modalType);
                                setModalType(null);
                            }}
                            folderActive={folderActive}
                            data={videoEditing}
                        />
                    ) : modalType === MODAL_ADD_FOLDER ||
                      (modalType === MODAL_EDIT_FOLDER && folderEditing) ? (
                        <AddVideoFolder
                            onForceUpdate={() => {
                                setForceUpdate(modalType);
                                setModalType(null);
                            }}
                            folderActive={folderActive}
                            data={folderEditing}
                        />
                    ) : (
                        <></>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default AdminVideo;
