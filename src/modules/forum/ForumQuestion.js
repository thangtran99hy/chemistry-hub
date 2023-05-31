import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import ForumAAdd from "./components/ForumAAdd";
import ForumAList from "./components/ForumAList";

const ForumQuestion = (props) => {
    const {questionId} = useParams();
    console.log('questionId',questionId);
    const [question, setQuestion] = useState(null);
    useEffect(() => {
        getInit()
    }, [])
    const getInit =async () => {
       try {
           const db = getFirestore();

           const docRef = doc(db, "forumQuestions", questionId);
           const docSnap = await getDoc(docRef);

           if (docSnap.exists()) {
               console.log("Document data:", docSnap.data());
               setQuestion({
                   id: questionId,
                   ...docSnap.data()
               })
           } else {
               // docSnap.data() will be undefined in this case
               console.log("No such document!");
           }
       } catch (e) {

       }
    }
    if (!question) return (<></>)
    return (
        <div>
            <div>
                <h3>{question.content}</h3>
                <p>Posted by: {question.firstName} {question.lastName}</p>
                {/*<p>Timestamp: {question.timestamp}</p>*/}
            </div>
            <ForumAAdd questionId={questionId}/>
            <ForumAList questionId={questionId}/>
        </div>
    )
}

export default ForumQuestion;