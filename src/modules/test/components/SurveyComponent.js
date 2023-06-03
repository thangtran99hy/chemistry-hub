import React from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';

const SurveyComponent = () => {
    const json = {
        title: 'Simple Survey',
        pages: [
            {
                questions: [
                    {
                        type: 'text',
                        name: 'name',
                        title: 'What is your name?',
                    },
                    {
                        type: 'radiogroup',
                        name: 'gender',
                        title: 'What is your gender?',
                        choices: ['Male', 'Female', 'Other'],
                    },
                    {
                        type: 'checkbox',
                        name: 'hobbies',
                        title: 'What are your hobbies?',
                        choices: ['Reading', 'Sports', 'Music', 'Traveling'],
                    },
                    {
                        type: 'comment',
                        name: 'feedback',
                        title: 'Any additional feedback?',
                    },
                ],
            },
        ],
    };

    const onComplete = (survey) => {
        console.log(survey.data); // You can perform any further actions with the survey data here
    };

    return <Survey.Survey json={json} onComplete={onComplete} />;
};

export default SurveyComponent;
