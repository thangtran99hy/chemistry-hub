import React, { useEffect, useState } from "react";
import { getDatabase, ref, child, get } from "firebase/database";

const ForumQList = (props) => {
    const db = getDatabase();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `forumQuestions`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const questionData = snapshot.val();

                    if (questionData) {
                        const questionList = Object.keys(questionData).map(
                            (key) => ({
                                id: key,
                                ...questionData[key],
                            })
                        );
                        setQuestions(questionList);
                    } else {
                        setQuestions([]);
                    }
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {};
    }, []);
    console.log("questions", questions);
    return (
        <div>
            {questions.map((question, index) => {
                return <div>{question.content}</div>;
            })}
        </div>
    );
};

export default ForumQList;
