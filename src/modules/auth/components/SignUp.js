import React, {useContext, useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "./../../../firebase";
import {AuthContext} from "../../../providers/AuthProvider";
import { Form, Input, Button } from 'antd';
import {getDatabase, ref, set} from "firebase/database";

const SignUp = (props) => {
    const { authUser, setAuthUser,isAuthModal,
        setIsAuthModal, } = useContext(AuthContext);

    const onFinish = (values) => {
        const { firstName, lastName, email, password } = values;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                saveUser({
                    uid: user.uid,
                    firstName,
                    lastName,
                    email
                })
                    .then(res => {
                        setAuthUser(user);
                    })

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const saveUser = async (payload) => {
        const {
            uid,
            firstName,
            lastName,
            email,
        } = payload;
        const db = getDatabase();
        return await set(ref(db, "users/" + uid), {
            firstName,
            lastName,
            email,
        });
    }
    return (
        <Form
            name="signUpForm"
            onFinish={onFinish}
            style={{ maxWidth: '300px', margin: '0 auto' }}
        >
            <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
            >
                <Input placeholder="Tên" />
            </Form.Item>

            <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Vui lòng nhập họ của bạn!' }]}
            >
                <Input placeholder="Họ" />
            </Form.Item>

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
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignUp;
