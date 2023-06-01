import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import ForumRAdd from "./components/ForumRAdd";
import ForumRList from "./components/ForumRList";
import moment from "moment/moment";

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
        <div className="">
            <div className="mb-4 pb-2 border-b border-b-gray-300">
                <div className="md" dangerouslySetInnerHTML={{__html: question.content}}></div>
                <div className="flex items-center mt-2">
                    <div className="font-bold mr-2 text-sm">{question.firstName} {question.lastName}</div>
                    <div className="italic text-xs">{question.timestamp?.seconds ? moment.unix(question.timestamp.seconds).calendar() : ''}</div>
                </div>
            </div>
            <div className="p-1">
                <div className="p-1">
                    <div className="font-bold text-2xl mb-2">Discuss the question</div>
                    <ForumRAdd questionId={questionId} replyId={[]}/>
                </div>
                <div className="p-1">
                    <ForumRList questionId={questionId} replyId={[]}/>
                </div>
            </div>
        </div>
    )
}

export default ForumQuestion;