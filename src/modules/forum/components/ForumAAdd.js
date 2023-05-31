import React, { useContext, useState } from "react";
import { List, Avatar, Typography, Comment, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const { TextArea } = Input;

const ForumAAdd = (props) => {
    const {questionId} = props;
    const { authUser, dataUser, setDataUser } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    const handleSubmit = async (value) => {
        if (!dataUser || !authUser) return;
        const db = getFirestore();

        try {


            // Add a new document in collection "cities"
            await setDoc(doc(db, `forumQuestions/${questionId}/answers`, uuidv4()), {
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
            <Typography.Title level={3}>Ask a Answer</Typography.Title>
            <TextArea
                rows={4}
                value={questionText}
                onChange={(event) => {
                    setQuestionText(event.target.value);
                }}
            />

            <Button
                // type="primary"
                onClick={() => handleSubmit("Submitted question")}
            >
                Submit
            </Button>
        </div>
    );
};

export default ForumAAdd;
