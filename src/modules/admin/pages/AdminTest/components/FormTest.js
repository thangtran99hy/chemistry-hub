import React, {useContext, useEffect, useRef, useState} from "react"
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import {Button, Checkbox, Form, notification} from "antd";
import {doc, getFirestore, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {AuthContext} from "../../../../../providers/AuthProvider";
import * as Survey from 'survey-react';

const creatorOptions = {
    showLogicTab: false,
    showJSONEditorTab: false,
    isAutoSave: true
};

const FormTest = (props) => {
    const {
        onForceUpdate,
        data
    } = props;
    const [form] = Form.useForm();

    const creator = new SurveyCreator(creatorOptions);
    const [api, contextHolder] = notification.useNotification();
    const { authUser, dataUser } = useContext(AuthContext);
    useEffect(() => {
        if (data?.data) {
            const surveyModel = new Survey.Model(data.data);
            creator.setSurvey(surveyModel)
        }

    }, [])

    const onFinish = async (values) => {
        const {isHide} = values;
        const dataSurvey = creator.getSurveyJSON();
        if (!dataSurvey.title) {
            api.warning({
                message: `Có lỗi xảy ra!`,
                placement: "topRight",
            });
            return;
        }
        const db = getFirestore();
        if (data) {
            updateDoc(doc(db, "test", data.id), {
                data: dataSurvey,
                isHide: !!isHide,
            })
                .then((res) => {
                    form.resetFields();
                    onForceUpdate();
                })
                .catch((err) => {
                    api.warning({
                        message: `Có lỗi xảy ra!`,
                        placement: "topRight",
                    });
                });
            return;
        }
        setDoc(doc(db, "test", uuidv4()), {
            uid: authUser.uid,
            firstName: dataUser.firstName,
            lastName: dataUser.lastName,
            timestamp: serverTimestamp(),
            data: dataSurvey,
            isHide: !!isHide
        })
            .then((res) => {
                onForceUpdate();
            })
            .catch((err) => {
                api.warning({
                    message: `Có lỗi xảy ra!`,
                    placement: "topRight",
                });
            });
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <SurveyCreatorComponent creator={creator}  />
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="isHide" valuePropName="checked">
                    <Checkbox>Ẩn</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Lưu</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    )
}

export default FormTest;