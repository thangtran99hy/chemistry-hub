import React, { useEffect, useState } from "react";
import AddDocs from "./components/AddDocs";
import ListDocs from "./components/ListDocs";
import { Button, Modal } from "antd";
import FormDocsFolder from "./components/FormDocsFolder";
import { HiFolderAdd } from "react-icons/hi";
import ListDocsFolders from "./components/ListDocsFolders";
const MODAL_ADD_FILE = 'add_file';
const MODAL_EDIT_FILE = 'edit_file';
const MODAL_ADD_FOLDER = 'add_folder';
const MODAL_EDIT_FOLDER = 'edit_folder';
const AdminDocs = (props) => {
    const [modalType, setModalType] = useState(null);
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
                        <Button  icon={<HiFolderAdd />} onClick={() => setModalType(MODAL_ADD_FOLDER)} />
                    </div>
                    <ListDocsFolders forceUpdate={forceUpdate === MODAL_ADD_FOLDER} onclickFolder={(id) => {
                        setFolderActive(id)
                    }}
                                     folderActive={folderActive}
                    />
                </div>
                <div className="px-2 flex-1 h-full">
                    <Button onClick={() => setModalType(MODAL_ADD_FILE)}>
                        Thêm mới tài liệu
                    </Button>
                    <ListDocs forceUpdate={forceUpdate === MODAL_ADD_FILE}   folderActive={folderActive}/>
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
                    {
                        (modalType === MODAL_ADD_FILE || modalType === MODAL_EDIT_FILE)
                        ?
                            <AddDocs
                                onForceUpdate={() => {
                                    setForceUpdate(MODAL_ADD_FILE);
                                    setModalType(null);
                                }}
                                folderActive={folderActive}
                            />
                            :
                            (modalType === MODAL_ADD_FOLDER || modalType === MODAL_EDIT_FOLDER)
                        ?
                                <FormDocsFolder
                                    onForceUpdate={() => {
                                        setForceUpdate(MODAL_ADD_FOLDER);
                                        setModalType(null);
                                    }}
                                    folderActive={folderActive}
                                    // isEdit={}
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
