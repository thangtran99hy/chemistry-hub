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
                console.log(errorCode, errorMessage);
                // ..
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
                rules={[{ required: true, message: 'Please enter your first name!' }]}
            >
                <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Please enter your last name!' }]}
            >
                <Input placeholder="Last Name" />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email address!' },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit">
                    Sign Up
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignUp;
