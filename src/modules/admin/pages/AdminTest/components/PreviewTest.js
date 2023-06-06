import React from "react"
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
const PreviewTest = (props) => {
    const {
        testPreview,
        data
    } = props;
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