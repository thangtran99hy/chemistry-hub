import React, { useContext, useState } from "react";
import { List, Avatar, Typography, Comment, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const { TextArea } = Input;

const ForumQAdd = () => {
    const { authUser } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    console.log("authUser", authUser);
    const handleSubmit = async (value) => {
        // // Handle submitting a new question or answer
        // console.log("Submitted:", value);
        // const questionRef = ref("questions");
        // const newQuestionRef = questionRef.push();

        // const newQuestion = {
        //     content: questionText,
        //     timestamp: database.ServerValue.TIMESTAMP,
        //     uid: authUser.uid,
        // };

        // newQuestionRef
        //     .set(newQuestion)
        //     .then(() => {
        //         console.log("Question added successfully.");
        //     })
        //     .catch((error) => {
        //         console.error("Error adding question:", error);
        //     });
        // const db = getDatabase();

        // set(ref(db, "forumQuestions/" + uuidv4()), {
        //     content: questionText,
        //     timestamp: serverTimestamp(),
        //     uid: authUser.uid,
        // });
        const db = getFirestore();

        try {
            const docRef = await addDoc(collection(db, "users"), {
                content: questionText,
                timestamp: serverTimestamp(),
                uid: authUser.uid,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div>
            <Typography.Title level={3}>Ask a Question</Typography.Title>
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

export default ForumQAdd;
