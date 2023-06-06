import React, {useContext, useEffect, useState} from "react";
import {  Input } from "antd";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import 'react-quill/dist/quill.snow.css';
import EditorBoxSend from "./EditorBoxSend";

const { TextArea } = Input;

const ForumRAdd = (props) => {
    const {questionId, replyId, onCancel, onSuccess} = props;
    const { authUser, dataUser, setDataUser } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    const handleSubmit = async (value) => {
        if (!dataUser || !authUser) return;
        const db = getFirestore();

        try {
            // Add a new document in collection "cities"
            await setDoc(doc(db, `forumQuestions/${questionId}/reply${replyId.map(item => `/${item}/reply`).join("")}`, uuidv4()), {
                content: questionText,
                timestamp: serverTimestamp(),
                uid: authUser.uid,
                firstName: dataUser.firstName,
                lastName: dataUser.lastName,
            });
            setQuestionText("")
            if (typeof onSuccess === "function") {
                onSuccess();
            }
            if (typeof onCancel === 'function') {
                onCancel()
            }
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.log("Error adding document: ", e);
        }
    };

    return (
        <div className='forumAdd'>
            <EditorBoxSend
                isSmall={true}
                value={questionText}
                onChange={(value) => {
                    setQuestionText(value)
                }}
                onSubmit={() => {
                    handleSubmit();
                }}
                onCancel={onCancel}
            />
        </div>
    );
};

export default ForumRAdd;
