import React, {useContext, useState} from "react";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import {auth} from "./../../../firebase";
import {AuthContext} from "../../../providers/AuthProvider";
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
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
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email address!' },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit">
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignIn;
