import React, {useState} from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
const AUTH_FORM_SIGNIN = 'signin';
const AUTH_FORM_SIGNUP = 'signup';

const Auth = (props) => {

    const [authFormType, setAuthFormType] = useState(AUTH_FORM_SIGNIN);
    const showContent = () => {
        switch (authFormType) {
            case AUTH_FORM_SIGNIN:
                return (
                    <SignIn />
                )
            case AUTH_FORM_SIGNUP:
                return (
                    <SignUp />
                )
            default:
                return (
                    <></>
                )
        }
    }

    const showFooter = () => {
        switch (authFormType) {
            case AUTH_FORM_SIGNIN:
                return (
                    <div>
                        <div>
                            Chưa có tài khoản? <span onClick={() => {
                                setAuthFormType(AUTH_FORM_SIGNUP)
                        }} className="ml-1 font-bold cursor-pointer">Đăng ký ngay</span>
                        </div>
                    </div>
                )
            case AUTH_FORM_SIGNUP:
                return (
                    <div>
                        <div>
                            Đã có tài khoản? <span onClick={() => {
                            setAuthFormType(AUTH_FORM_SIGNIN)
                        }} className="ml-1 font-bold cursor-pointer">Đăng nhập ngay</span>
                        </div>
                    </div>
                )
            default:
                return (
                    <></>
                )
        }
    }
    return (
        <div>
            <div>
                {showContent()}
            </div>
            <div>
                {showFooter()}
            </div>
        </div>
    )
}

export default Auth;