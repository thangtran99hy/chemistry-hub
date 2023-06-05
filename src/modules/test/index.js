import React from "react";
import ListTest from "../admin/pages/AdminTest/components/ListTest";
import {useNavigate} from "react-router-dom";
import * as links from "./../../routes/links"
const Test = (props) => {
    const navigate = useNavigate();
    const onTakeTest = (item) => {
        navigate(links.PATH_TAKE_TEST.replace(':id', item.id))
    }
    return <div>
        <ListTest onClickItem={(item) => onTakeTest(item)} isDisplay={true} />
    </div>;
};

export default Test;
