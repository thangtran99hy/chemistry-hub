import React, { useEffect, useState } from "react";
import {doc, getDoc, getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import { List } from 'antd';
import {useNavigate} from "react-router-dom";

const ForumQList = (props) => {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);

    useEffect( () => {
        getInit()
    }, []);
    const getInit = async () => {
        try {
            const db = getFirestore();
            const q = query(collection(db, "forumQuestions"));

            const querySnapshot = await getDocs(q);
            console.log('querySnapshot',querySnapshot)
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
                    <List.Item className="cursor-pointer" onClick={() => {
                        onGoToFormQuestion(question)
                    }}>
                        <div>
                            <h3>{question.content}</h3>
                            <p>Posted by: {question.firstName} {question.lastName}</p>
                            {/*<p>Timestamp: {question.timestamp}</p>*/}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ForumQList;
