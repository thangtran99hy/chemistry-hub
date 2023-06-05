import React, { useState } from "react";
import ListVideoFolders from "../admin/pages/AdminVideo/components/ListVideoFolders";
import ListVideo from "../admin/pages/AdminVideo/components/ListVideo";
const Video = (props) => {
    const [forceUpdate, setForceUpdate] = useState(null);
    const [folderActive, setFolderActive] = useState(null);

    return (
        <div className="flex items-start h-full">
            <div className="w-[150px] pr-2 border-r border-r-gray-200 h-full">
                <ListVideoFolders
                    onclickFolder={(id) => {
                        setFolderActive(id);
                    }}
                    folderActive={folderActive}
                    isDisplay={true}
                />
            </div>
            <div className="px-2 flex-1 h-full">
                <ListVideo
                    forceUpdate={forceUpdate}
                    folderActive={folderActive}
                    isDisplay={true}
                />
            </div>
        </div>
    );
};

export default Video;
