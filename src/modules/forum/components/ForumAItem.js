import React, {useState} from "react";
import {Button} from "antd";
import {BsFillReplyFill} from "react-icons/bs";
import ForumRAdd from "./ForumRAdd";
const ForumAItem = (props) => {
    const {
        questionId,
        answer
    } = props;
    const [isReply, setIsReply] = useState(false);
    console.log('replyId',answer)
    return (
        <div className="w-full">
            <div className="flex ">
                <div className="flex-1">
                    <h3>{answer.content}</h3>
                    <p>Posted by: {answer.firstName} {answer.lastName}</p>
                </div>
                <div>
                    <Button onClick={() => {
                        setIsReply(prev => !prev)
                    }}  shape="circle" icon={<BsFillReplyFill />} />
                </div>
            </div>
            {isReply && <ForumRAdd
                questionId={questionId}
                answer={answer}
                replyId={[answer.id]}
            />}

        </div>
    )
}

export default ForumAItem;