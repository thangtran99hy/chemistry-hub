import React, { useContext, useState } from "react";
import { Typography } from "antd";
import { AuthContext } from "../../../providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import EditorBoxSend from "./EditorBoxSend";

const ForumQAdd = (props) => {
    const {
        onForceUpdate
    } = props;
    const { authUser, dataUser,
        setIsAuthModal } = useContext(AuthContext);
    const [questionText, setQuestionText] = useState("");
    const onSubmit = () => {
        if (questionText === "") return;
        if (!dataUser || !authUser) {
            setIsAuthModal(true)
            return;
        }
        const db = getFirestore();
        try {
            setDoc(doc(db, "forumQuestions", uuidv4()), {
                content: questionText,
                timestamp: serverTimestamp(),
                uid: authUser.uid,
                firstName: dataUser.firstName,
                lastName: dataUser.lastName,
            }).then(res => {
                onForceUpdate()
                setQuestionText("")
            })
                .catch(err => {

                })
        } catch (e) {
            console.log("Error adding document: ", e);
        }
    }
    return (
        <div className="p-2">
            <div className="font-bold text-2xl mb-2">Ask a Question</div>
            <EditorBoxSend
                value={questionText}
                onChange={(value) => {
                    setQuestionText(value)
                }}
                onSubmit={() => onSubmit()}
            />
        </div>
    );
};

export default ForumQAdd;
