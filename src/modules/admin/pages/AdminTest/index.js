import React, { useEffect, useState } from "react";
import AddTest from "./components/AddTest";
import ListTest from "./components/ListTest";
import { Button, Modal } from "antd";
import PreviewTest from "./components/PreviewTest";
const AdminTest = (props) => {
    const [isModalAdd, setIsModalAdd] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(null);
    const [folderActive, setFolderActive] = useState(null);
    const [testPreview, setTestPreview] = useState(null);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(null);
        }
    }, [forceUpdate]);
    return (
        <div className="flex items-start h-full">
            <Button onClick={() => setIsModalAdd(true)}>
                Thêm mới bài test
            </Button>
            <ListTest forceUpdate={forceUpdate} onClickItem={(item) => setTestPreview(item)}/>
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
                    className="w-[100vw] h-[100vh top-0 bottom-0 left-0 right-0 addTestModal"
                >
                    <AddTest
                        onForceUpdate={() => {
                            setForceUpdate(true);
                            setIsModalAdd(null);
                        }}
                        folderActive={folderActive}
                    />
                </Modal>
            )}
            {testPreview && (
                <Modal
                    open={!!testPreview}
                    onClose={() => {
                        setTestPreview(null);
                    }}
                    onCancel={() => {
                        setTestPreview(null);
                    }}
                    footer={null}
                >
                    <PreviewTest testPreview={testPreview} />
                </Modal>
            )}
        </div>
    );
};

export default AdminTest;
