import React from "react";
import Sidebar from "./Sidebar";
const LayoutApp = (props) => {
    const { children } = props;
    return (
        <div className="flex h-[100vh]">
            <Sidebar />
            <div className="flex-1 p-2 overflow-y-auto">{children}</div>
        </div>
    );
};

export default LayoutApp;
