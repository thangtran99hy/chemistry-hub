import React, {useContext, useState} from "react";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import {auth} from "./../../../firebase";
import {AuthContext} from "../../../providers/AuthProvider";
import { Form, Input, Button } from 'antd';
const SignIn = (props) => {
    const { authUser, setAuthUser,isAuthModal,
        setIsAuthModal, } = useContext(AuthContext);
    const onFinish = (values) => {
        const {
            email,
            password
        } = values;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setAuthUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <Form
            onFinish={onFinish}
            initialValues={{ remember: true }}
            style={{ maxWidth: '300px', margin: '0 auto' }}
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email của bạn!' },
                    { type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ!' },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
            >
                <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignIn;
