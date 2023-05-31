import React from "react";
import { useLocation } from "react-router-dom";
const Docs = (props) => {
    const location = useLocation();
    console.log("location", location);
    return <div>Docs</div>;
};

export default Docs;
