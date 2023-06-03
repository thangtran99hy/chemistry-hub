import React, { useEffect, useState } from "react";
import AddDocs from "./components/AddTest";
import ListDocs from "./components/ListTest";
import { Button, Modal } from "antd";
import { HiFolderAdd } from "react-icons/hi";
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
            <Button onClick={() => setIsModalAdd(MODAL_ADD_FILE)}>
                Thêm mới bài test
            </Button>
            <ListDocs forceUpdate={forceUpdate === MODAL_ADD_FILE}   folderActive={folderActive}/>
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
                    <AddDocs
                        onForceUpdate={() => {
                            setForceUpdate(MODAL_ADD_FILE);
                            setIsModalAdd(null);
                        }}
                        folderActive={folderActive}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminDocs;
