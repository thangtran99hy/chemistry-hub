import React from "react";
import { useLocation } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
const Docs = (props) => {
    const location = useLocation();
    return <div>
        <FileUpload />

    </div>;
};

export default Docs;