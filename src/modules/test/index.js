import React, {useContext} from "react";
import ListTest from "../admin/pages/AdminTest/components/ListTest";
import {useNavigate} from "react-router-dom";
import * as links from "./../../routes/links"
import {AuthContext} from "../../providers/AuthProvider";
const Test = (props) => {
    const navigate = useNavigate();
    const { authUser, dataUser,
        setIsAuthModal } = useContext(AuthContext);
    const onTakeTest = (item) => {
        if (!dataUser || !authUser) {
            setIsAuthModal(true)
            return;
        }
        navigate(links.PATH_TAKE_TEST.replace(':id', item.id))
    }
    return <div>
        <ListTest onClickItem={(item) => onTakeTest(item)} isDisplay={true} />
    </div>;
};

export default Test;
