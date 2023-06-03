import React, {useRef} from "react"
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import {Button} from "antd";

const creatorOptions = {
    showLogicTab: false,
    showJSONEditorTab: false,
    isAutoSave: true
};

const AddTest = (props) => {
    const creator = new SurveyCreator(creatorOptions);
    const surveyCreatorRef = useRef(null);

    // creator.saveSurveyFunc = (saveNo, callback) => {
    //     console.log('creator.text',creator.text)
    //     // window.localStorage.setItem("survey-json", creator.text);
    //     // callback(saveNo, true);
    //     // saveSurveyJson(
    //     //     "https://your-web-service.com/",
    //     //     creator.JSON,
    //     //     saveNo,
    //     //     callback
    //     // );
    // };
    // console.log(creator.JSON)
    const onSave = () => {
        // const survey = surveyCreatorRef.current.getJSON();
        // Handle saving the survey data
        console.log(creator.getSurveyJSON());
    }
    return (
        <div>
            <Button onClick={() => {
                onSave()
            }}>
                Save
            </Button>
            <SurveyCreatorComponent creator={creator} ref={surveyCreatorRef} />

        </div>
    )
}

export default AddTest;