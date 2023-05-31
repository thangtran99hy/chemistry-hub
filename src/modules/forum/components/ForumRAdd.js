import React, { useContext, useState } from "react";
import { List, Avatar, Typography, Comment, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import {AiOutlineSend} from "react-icons/ai";

const { TextArea } = Input;

const ForumRAdd = (props) => {
    const {questionId, replyId} = props;
    const { authUser, dataUser, setDataUser } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    const handleSubmit = async (value) => {
        if (!dataUser || !authUser) return;
        const db = getFirestore();

        try {


            // Add a new document in collection "cities"
            await setDoc(doc(db, `forumQuestions/${questionId}/answers/${replyId.map(item => `${item}/reply`).join("/")}`, uuidv4()), {
                content: questionText,
                timestamp: serverTimestamp(),
                uid: authUser.uid,
                firstName: dataUser.firstName,
                lastName: dataUser.lastName,
            });
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.log("Error adding document: ", e);
        }
    };

    return (
        <div>
            <TextArea
                rows={2}
                value={questionText}
                onChange={(event) => {
                    setQuestionText(event.target.value);
                }}
            />

            <Button onClick={() => {
                handleSubmit();
            }}  shape="circle" icon={<AiOutlineSend />} />
        </div>
    );
};

export default ForumRAdd;
