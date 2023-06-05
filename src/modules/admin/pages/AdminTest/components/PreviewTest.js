import React from "react"
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
const PreviewTest = (props) => {
    const {
        testPreview,
        data
    } = props;
    const onComplete = (survey) => {
        console.log(survey.data); // You can perform any further actions with the survey data here
    };
    const surveyModel = new Survey.Model(testPreview.data);
    if (data) {
        surveyModel.data = data ?? {};
    }
    surveyModel.mode = 'display';

    return (
        <Survey.Survey model={surveyModel}/>
    )
}

export default PreviewTest;