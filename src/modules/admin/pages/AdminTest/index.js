import React, { useEffect, useState } from "react";
import FormTest from "./components/FormTest";
import ListTest from "./components/ListTest";
import { Button, Modal } from "antd";
import PreviewTest from "./components/PreviewTest";
const MODAL_ADD_TEST = "add_test";
const MODAL_EDIT_TEST = "edit_test";
const AdminTest = (props) => {
    const [modalType, setModalType] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(null);
    const [folderActive, setFolderActive] = useState(null);
    const [testPreview, setTestPreview] = useState(null);
    const[testEditing, setTestEditing] = useState(null)
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(null);
        }
    }, [forceUpdate]);
    return (
        <div className="flex flex-col items-start h-full">
            <Button onClick={() => setModalType(MODAL_ADD_TEST)}>
                Thêm mới bài test
            </Button>
            <ListTest
                forceUpdate={forceUpdate}
                onClickItem={(item) => setTestPreview(item)}
                onEditDoc={(item) => {
                    setTestEditing(item);
                    setModalType(MODAL_EDIT_TEST)
                }}
            />
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
                    className="w-[100vw] h-[100vh top-0 bottom-0 left-0 right-0 addTestModal"
                >
                    <FormTest
                        onForceUpdate={() => {
                            setForceUpdate(true);
                            setModalType(null);
                        }}
                        folderActive={folderActive}
                        data={testEditing}
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
                    className="w-[100vw] h-[100vh top-0 bottom-0 left-0 right-0 previewTestModal"
                >
                    <PreviewTest testPreview={testPreview} />
                </Modal>
            )}
        </div>
    );
};

export default AdminTest;
