import React from "react";
import AdminSidebar from "./AdminSidebar";
const LayoutAdmin = (props) => {
    const { children } = props;
    return (
        <div className="p-1 flex flex-col h-full">
            <AdminSidebar />
            <div
                className="p-2 flex-1"
                style={{
                    height: "calc(100% - 80px)",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default LayoutAdmin;
