import React, {useEffect, useState} from "react";
import ForumQAdd from "./components/ForumQAdd";
import ForumQList from "./components/ForumQList";
const Forum = (props) => {
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false)
        }
    }, [forceUpdate])
    return (
        <div className="flex flex-col h-full">
            <ForumQAdd
                onForceUpdate={() => {
                    setForceUpdate(true)
                }}
            />
            <ForumQList forceUpdate={forceUpdate}/>
        </div>
    );
};

export default Forum;
