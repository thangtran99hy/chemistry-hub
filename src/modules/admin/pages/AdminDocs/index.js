import React, { useEffect, useState } from "react";
import AddDocs from "./components/AddDocs";
import ListDocs from "./components/ListDocs";
import { Button, Modal } from "antd";
import AddDocsFolder from "./components/AddDocsFolder";
// IoAddCircle
import { HiFolderAdd } from "react-icons/hi";
import ListDocsFolders from "./components/ListDocsFolders";
const MODAL_ADD_FILE = 'add_file';
const MODAL_ADD_FOLDER = 'add_folder';
const AdminDocs = (props) => {
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
                    <ListDocsFolders forceUpdate={forceUpdate === MODAL_ADD_FOLDER} onclickFolder={(id) => {
                        setFolderActive(id)
                    }}
                                     folderActive={folderActive}
                    />
                </div>
                <div className="px-2 flex-1 h-full">
                    <Button onClick={() => setIsModalAdd(MODAL_ADD_FILE)}>
                        Thêm mới tài liệu
                    </Button>
                    <ListDocs forceUpdate={forceUpdate === MODAL_ADD_FILE}   folderActive={folderActive}/>
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
                            <AddDocs
                                onForceUpdate={() => {
                                    setForceUpdate(MODAL_ADD_FILE);
                                    setIsModalAdd(null);
                                }}
                                folderActive={folderActive}
                            />
                            :
                            isModalAdd === MODAL_ADD_FOLDER
                        ?
                                <AddDocsFolder
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

export default AdminDocs;
