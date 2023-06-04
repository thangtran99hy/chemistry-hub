import React, {useContext, useRef} from "react"
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import {Button, notification} from "antd";
import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {AuthContext} from "../../../../../providers/AuthProvider";

const creatorOptions = {
    showLogicTab: false,
    showJSONEditorTab: false,
    isAutoSave: true
};

const AddTest = (props) => {
    const {
        onForceUpdate
    } = props;
    const creator = new SurveyCreator(creatorOptions);
    const surveyCreatorRef = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const { authUser, dataUser } = useContext(AuthContext);


    const onSave = () => {
        // const survey = surveyCreatorRef.current.getJSON();
        // Handle saving the survey data
        const data = creator.getSurveyJSON();
        if (!data.title) {
            api.warning({
                message: `Bạn phải nhập tiêu đề!`,
                placement: "topRight",
            });
            return;
        }
        const db = getFirestore();
        setDoc(doc(db, "test", uuidv4()), {
            uid: authUser.uid,
            firstName: dataUser.firstName,
            lastName: dataUser.lastName,
            timestamp: serverTimestamp(),
            isPublic: false,
            data: data
        })
            .then((res) => {
                onForceUpdate();
            })
            .catch((err) => {
                api.warning({
                    message: `Gặp lỗi khi tải file lên!`,
                    placement: "topRight",
                });
            });
    }
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <SurveyCreatorComponent creator={creator} ref={surveyCreatorRef} />
            </div>
            <div className="p-2">
                <Button onClick={() => {
                    onSave()
                }}>
                    Save
                </Button>
            </div>
            {contextHolder}
        </div>
    )
}

export default AddTest;