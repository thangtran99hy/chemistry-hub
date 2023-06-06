import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {BsFillReplyFill} from "react-icons/bs";

import {AiOutlineLike} from "react-icons/ai";
import ForumRAdd from "./ForumRAdd";
import ForumRList from "./ForumRList";
import "./style.scss"
import moment from "moment";
const ForumRItem = (props) => {
    const {
        questionId,
        answer,
        replyId
    } = props;
    const [isReply, setIsReply] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false)
        }
    }, [forceUpdate])
    return (
        <div className={`w-full ${replyId.length > 0 ? 'itemR' : ''}`}>
            <div className="flex border border-gray-200 rounded-xl p-2 answerBoxContent">
                <div className="flex-1">
                    <div className="text-sm" dangerouslySetInnerHTML={{__html: answer.content}}></div>
                    <div className="flex items-center mt-2">
                        <div className="font-bold mr-2 text-xs">{answer.firstName} {answer.lastName}</div>
                        <div className="italic text-xs">{answer.timestamp?.seconds ? moment.unix(answer.timestamp.seconds).calendar() : ''}</div>
                    </div>
                </div>
                <div className="flex items-center">
                    {/*<Button onClick={() => {*/}

                    {/*}}  shape="circle" icon={<AiOutlineLike />} />*/}
                    <Button className="replyIcon" onClick={() => {
                        setIsReply(prev => !prev)
                    }}  shape="circle" icon={<BsFillReplyFill />} />
                </div>
            </div>
            <div className="cursor-pointer text-gray-400 text-xs hover:text-gray-700" onClick={() => {
                setShowReply(prev => !prev)
            }}>
                {showReply ? 'hide replies' : 'show replies'}
            </div>
            <div className="pl-3 border-l ml-1 listR mb-3" >
                {
                    showReply &&
                    <ForumRList
                        questionId={questionId}
                        answer={answer}
                        replyId={[...replyId, answer.id]}
                        forceUpdate={forceUpdate}
                    />
                }
                {isReply && <div className="pl-3">
                    <ForumRAdd
                        questionId={questionId}
                        answer={answer}
                        replyId={[...replyId, answer.id]}
                        onCancel={() => {
                            setIsReply(prev => !prev)
                        }}
                        onSuccess={() => {
                            if (showReply) {
                                setForceUpdate(true)
                            } else {
                                setShowReply(true)
                            }
                        }}
                    />
                </div>}
            </div>
        </div>
    )
}

export default ForumRItem;