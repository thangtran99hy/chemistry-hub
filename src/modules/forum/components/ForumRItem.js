import React, {useState} from "react";
import {Button} from "antd";
import {BsFillReplyFill} from "react-icons/bs";

import {AiOutlineLike} from "react-icons/ai";
import ForumRAdd from "./ForumRAdd";
import ForumRList from "./ForumRList";
import "./style.scss"
const ForumRItem = (props) => {
    const {
        questionId,
        answer,
        replyId
    } = props;
    const [isReply, setIsReply] = useState(false);
    const [showReply, setShowReply] = useState(false);
    console.log('replyId',answer)
    return (
        <div className="w-full itemR">
            <div className="flex bg-gray-100 p-2">
                <div className="flex-1">
                    <div dangerouslySetInnerHTML={{__html: answer.content}}></div>
                    <p>Posted by: {answer.firstName} {answer.lastName}</p>
                </div>
                <div className="flex items-center">
                    <Button onClick={() => {

                    }}  shape="circle" icon={<AiOutlineLike />} />
                    <Button onClick={() => {
                        setIsReply(prev => !prev)
                    }}  shape="circle" icon={<BsFillReplyFill />} />
                </div>
            </div>
            <div className="cursor-pointer text-gray-400 font-bold" onClick={() => {
                setShowReply(prev => !prev)
            }}>
                {showReply ? 'hide' : 'show'}
            </div>
            <div className="pl-3 border-l ml-1 listR" >
                {
                    showReply &&
                    <ForumRList
                        questionId={questionId}
                        answer={answer}
                        replyId={[...replyId, answer.id]}
                    />
                }
                {isReply && <ForumRAdd
                    questionId={questionId}
                    answer={answer}
                    replyId={[...replyId, answer.id]}
                />}
            </div>
        </div>
    )
}

export default ForumRItem;