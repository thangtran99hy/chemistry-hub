import React from "react";
import ForumQAdd from "./components/ForumQAdd";
import ForumQList from "./components/ForumQList";
const Forum = (props) => {
    return (
        <div>
            <ForumQAdd />
            <ForumQList />
        </div>
    );
};

export default Forum;
