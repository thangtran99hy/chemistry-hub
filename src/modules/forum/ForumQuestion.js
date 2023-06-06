import React, {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import ForumRAdd from "./components/ForumRAdd";
import ForumRList from "./components/ForumRList";
import moment from "moment/moment";
import * as links from "../../routes/links";
import {Button} from "antd";
import {BiArrowBack} from "react-icons/bi";

const ForumQuestion = (props) => {
    const {questionId} = useParams();
    const [question, setQuestion] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false)
        }
    }, [forceUpdate])
    useEffect(() => {
        getInit()
    }, [])
    const getInit =async () => {
       try {
           const db = getFirestore();

           const docRef = doc(db, "forumQuestions", questionId);
           const docSnap = await getDoc(docRef);

           if (docSnap.exists()) {
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
        <div className="flex flex-col h-full">
            <div>
                <NavLink to={links.PATH_FORUM}>
                    <Button icon={<BiArrowBack />}>
                        Back
                    </Button>
                </NavLink>
            </div>
            <div className="flex-1 overflow-y-auto">
               <div className="mb-4 pb-2 border-b border-b-gray-300">
                   <div className="text-xl font-bold" dangerouslySetInnerHTML={{__html: question.content}}></div>
                   <div className="flex items-center mt-2">
                       <div className="font-bold mr-2 text-sm">{question.firstName} {question.lastName}</div>
                       <div className="italic text-xs">{question.timestamp?.seconds ? moment.unix(question.timestamp.seconds).calendar() : ''}</div>
                   </div>
               </div>
               <div className="p-1">
                   <div className="p-1">
                       <div className="font-bold text-2xl mb-2">Discuss the question</div>
                       <ForumRAdd questionId={questionId} replyId={[]} onSuccess={() => {
                           setForceUpdate(true)
                       }}/>
                   </div>
                   <div className="p-1">
                       <ForumRList questionId={questionId} replyId={[]} forceUpdate={forceUpdate}/>
                   </div>
               </div>
           </div>
       </div>
    )
}

export default ForumQuestion;