import React, { useEffect, useState } from "react";
import AddDocs from "./components/AddDocs";
import ListDocs from "./components/ListDocs";
import { Button, Modal } from "antd";

const AdminDocs = (props) => {
    const [isModalAdd, setIsModalAdd] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate]);
    return (
        <div className="flex flex-col items-start h-full">
            {/* <AddDocs /> */}
            <Button onClick={() => setIsModalAdd(true)}>
                Thêm mới tài liệu
            </Button>
            <ListDocs forceUpdate={forceUpdate} />
            {isModalAdd && (
                <Modal
                    open={isModalAdd}
                    onClose={() => {
                        setIsModalAdd(false);
                    }}
                    onCancel={() => {
                        setIsModalAdd(false);
                    }}
                    footer={null}
                >
                    <AddDocs
                        onForceUpdate={() => {
                            setForceUpdate(true);
                            setIsModalAdd(false);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminDocs;
