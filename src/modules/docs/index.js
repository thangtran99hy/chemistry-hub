import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ListDocsFolders from "../admin/pages/AdminDocs/components/ListDocsFolders";
import ListDocs from "../admin/pages/AdminDocs/components/ListDocs";
const Docs = (props) => {
    const [folderActive, setFolderActive] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(null);

    return (
        <div className="flex items-start h-full">
            <div className="w-[150px] pr-2 border-r border-r-gray-200 h-full">
                <ListDocsFolders
                    forceUpdate={forceUpdate}
                    onclickFolder={(id) => {
                        setFolderActive(id);
                    }}
                    folderActive={folderActive}
                    isDisplay={true}
                />
            </div>
            <div className="px-2 flex-1 h-full">
                <ListDocs
                    forceUpdate={forceUpdate}
                    folderActive={folderActive}
                    isDisplay={true}
                />
            </div>
        </div>
    );
};

export default Docs;
