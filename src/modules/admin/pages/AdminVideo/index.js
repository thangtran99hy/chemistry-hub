import React, { useEffect, useState } from "react";
import AddVideo from "./components/AddVideo";
import ListVideo from "./components/ListVideo";
import { Button, Modal } from "antd";
import AddVideoFolder from "./components/AddVideoFolder";
// IoAddCircle
import { HiFolderAdd } from "react-icons/hi";
import ListVideoFolders from "./components/ListVideoFolders";
const MODAL_ADD_FILE = 'add_file';
const MODAL_ADD_FOLDER = 'add_folder';
const AdminVideo = (props) => {
    const [isModalAdd, setIsModalAdd] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(null);
    const [folderActive, setFolderActive] = useState(null);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(null);
        }
    }, [forceUpdate]);
    return (
        <div className="flex items-start h-full">
            <div className="w-[150px] pr-2 border-r border-r-gray-200 h-full">
                <div className="flex items-center justify-between py-1">
                    <div>
                        Folders
                    </div>
                    <Button  icon={<HiFolderAdd />} onClick={() => setIsModalAdd(MODAL_ADD_FOLDER)} />
                </div>
                <ListVideoFolders forceUpdate={forceUpdate === MODAL_ADD_FOLDER} onclickFolder={(id) => {
                    setFolderActive(id)
                }}
                                  folderActive={folderActive}
                />
            </div>
            <div className="px-2 flex-1 h-full">
                <Button onClick={() => setIsModalAdd(MODAL_ADD_FILE)}>
                    Thêm mới video
                </Button>
                <ListVideo forceUpdate={forceUpdate === MODAL_ADD_FILE} folderActive={folderActive}/>
            </div>
            {isModalAdd && (
                <Modal
                    open={!!isModalAdd}
                    onClose={() => {
                        setIsModalAdd(null);
                    }}
                    onCancel={() => {
                        setIsModalAdd(null);
                    }}
                    footer={null}
                >
                    {
                        isModalAdd === MODAL_ADD_FILE
                            ?
                            <AddVideo
                                onForceUpdate={() => {
                                    setForceUpdate(MODAL_ADD_FILE);
                                    setIsModalAdd(null);
                                }}
                                folderActive={folderActive}
                            />
                            :
                            isModalAdd === MODAL_ADD_FOLDER
                                ?
                                <AddVideoFolder
                                    onForceUpdate={() => {
                                        setForceUpdate(MODAL_ADD_FOLDER);
                                        setIsModalAdd(null);
                                    }}
                                    folderActive={folderActive}
                                />
                                :
                                <></>
                    }
                </Modal>
            )}
        </div>
    );
};

export default AdminVideo;
