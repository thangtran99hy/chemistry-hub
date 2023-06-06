import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import SignUp from "../auth/components/SignUp";
import { Button } from "antd";
import { AuthContext } from "../../providers/AuthProvider";

const Home = (props) => {
    const { authUser, isAuthModal, setIsAuthModal } = useContext(AuthContext);

    return (
        <div>
            {!authUser && (
                <Button
                    onClick={() => {
                        setIsAuthModal(true);
                    }}
                >
                    Đăng nhập
                </Button>
            )}
        </div>
    );
};

export default Home;
