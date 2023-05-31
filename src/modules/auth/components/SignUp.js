import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../../firebase";
import { AuthContext } from "../../../providers/AuthProvider";
import { Button, Input } from "antd";
const SignUp = (props) => {
    const { authUser, setAuthUser } = useContext(AuthContext);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const { firstName, lastName, email, password } = data;

    const onChange = (name, value) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                setAuthUser(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    };
    return (
        <div>
            <div>
                <label htmlFor="email-address">First name</label>
                <Input
                    type="text"
                    label="First name"
                    value={firstName}
                    onChange={(e) => onChange("firstName", e.target.value)}
                    required
                    placeholder="First name"
                />
            </div>
            <div>
                <label htmlFor="email-address">Last name</label>
                <Input
                    type="text"
                    label="Last name"
                    value={lastName}
                    onChange={(e) => onChange("lastName", e.target.value)}
                    required
                    placeholder="Last name"
                />
            </div>
            <div>
                <label htmlFor="email-address">Email address</label>
                <Input
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                    placeholder="Email address"
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <Input
                    type="password"
                    label="Create password"
                    value={password}
                    onChange={(e) => onChange("password", e.target.value)}
                    required
                    placeholder="Password"
                />
            </div>

            <Button onClick={onSubmit}>Sign up</Button>
        </div>
    );
};

export default SignUp;
