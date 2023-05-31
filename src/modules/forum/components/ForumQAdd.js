import React, { useContext, useState } from "react";
import { List, Avatar, Typography, Comment, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const { TextArea } = Input;

const ForumQAdd = () => {
    const { authUser, dataUser,
        setDataUser } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    const handleSubmit = async (value) => {
        if (!dataUser || !authUser) return;
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
            // const docRef = await addDoc(collection(db, "forumQuestions"), {
            //     content: questionText,
            //     timestamp: serverTimestamp(),
            //     uid: authUser.uid,
            //     firstName: dataUser.firstName,
            //     lastName: dataUser.lastName,
            // });

            // Add a new document in collection "cities"
            await setDoc(doc(db, "forumQuestions", uuidv4()), {
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
