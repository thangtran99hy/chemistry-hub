import React from "react"
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
const PreviewTest = (props) => {
    const {
        testPreview
    } = props;
    const onComplete = (survey) => {
        console.log(survey.data); // You can perform any further actions with the survey data here
    };
    return (
        <div>
            <Survey.Survey json={testPreview.data} onComplete={onComplete} />;
        </div>
    )
}

export default PreviewTest;