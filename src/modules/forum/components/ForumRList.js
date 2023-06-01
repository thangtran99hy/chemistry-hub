import React, { useEffect, useState } from "react";
import {doc, getDoc, getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import {Button, List} from 'antd';
import {useNavigate} from "react-router-dom";
import { BsFillReplyFill } from "react-icons/bs";
import ForumRItem from "./ForumRItem";

const ForumRList = (props) => {
    const {
        questionId, replyId
    } =props;
    const [questions, setQuestions] = useState([]);

    useEffect( () => {
        getInit()
    }, []);
    const getInit = async () => {
        try {
            const db = getFirestore();
            const q = query(collection(db, `forumQuestions/${questionId}/reply${replyId.map(item => `/${item}/reply`).join("")}`));
            const querySnapshot = await getDocs(q);
            let items = []
            querySnapshot.forEach((doc) => {
                items = [...items, {
                    id: doc.id,
                    ...doc.data()
                }]
            });
            setQuestions(items)
        } catch (e) {
            console.log('e',e)
        }
    }

    return (
        <div className="pl-3">
            {
                questions.map((question) => {
                    return (
                        <ForumRItem
                            answer={question}
                            questionId={questionId}
                            replyId={replyId}
                        />
                    )
                })
            }
        </div>
    );
};

export default ForumRList;
