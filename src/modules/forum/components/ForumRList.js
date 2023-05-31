import React, { useEffect, useState } from "react";
import {doc, getDoc, getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import {Button, List} from 'antd';
import {useNavigate} from "react-router-dom";
import { BsFillReplyFill } from "react-icons/bs";
import ForumAItem from "./ForumAItem";

const ForumRList = (props) => {
    const {
        questionId
    } =props;
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);

    useEffect( () => {
        getInit()
    }, []);
    const getInit = async () => {
        try {
            const db = getFirestore();
            const q = query(collection(db, `forumQuestions/${questionId}/answers`));

            const querySnapshot = await getDocs(q);
            let items = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                items = [...items, {
                    id: doc.id,
                    ...doc.data()
                }]
            });
            setQuestions(items)
        } catch (e) {
            console.log('e',e)
        }
        // const dbRef = ref(getDatabase());
        // get(child(dbRef, `forumQuestions`))
        //     .then((snapshot) => {
        //         if (snapshot.exists()) {
        //             const questionData = snapshot.val();
        //
        //             if (questionData) {
        //                 const questionList = Object.keys(questionData).map(
        //                     (key) => ({
        //                         id: key,
        //                         ...questionData[key],
        //                     })
        //                 );
        //                 setQuestions(questionList);
        //             } else {
        //                 setQuestions([]);
        //             }
        //         } else {
        //             console.log("No data available");
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
        //
        // return () => {};
    }

    const onGoToFormQuestion = (question) => {
        console.log('question',question)
        navigate(question.id)
    }
    return (
        <div>
            <List
                dataSource={questions}
                renderItem={(question) => (
                    <List.Item className="">
                        <ForumAItem answer={question} questionId={questionId}/>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ForumRList;
