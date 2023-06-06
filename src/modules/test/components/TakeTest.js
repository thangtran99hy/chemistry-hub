import React, {useContext, useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import {AuthContext} from "../../../providers/AuthProvider";
import {Button, notification} from "antd";
// BiArrowBack
import { BiArrowBack } from "react-icons/bi";
import * as links from "./../../../routes/links"
const TakeTest = (props) => {
    const {id} = useParams();
    const [test, setTest] = useState(null);
    const [takeTest, setTakeTest] = useState(null);
    const [viewTake, setViewTake] = useState(false)
    const { authUser, dataUser } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        getInit();
    }, [])

    const getInit =async () => {
        try {
            const db = getFirestore();
            const docRef = doc(db, "test", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTest({
                    id: id,
                    ...docSnap.data(),
                    takeUsers: Array.isArray(docSnap.data().takeUsers) ? docSnap.data().takeUsers : [],
                })
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

        } catch (e) {

        }
    }

    const showTest = async () => {
        try {
            const db = getFirestore();
            const takeTestRef = doc(db, "takeTest", `${id}:${authUser.uid}`);
            const takeTestSnap = await getDoc(takeTestRef);
            if (takeTestSnap.exists()) {
                setTakeTest({
                    id: `${id}:${authUser.uid}`,
                    ...takeTestSnap.data()
                })
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (e) {

        }
    }

    useEffect(() => {
        if (viewTake && !takeTest) {
            showTest();
        }
    }, [viewTake])

    const onComplete =  async (survey) => {
        const db = getFirestore();
        setDoc(doc(db, "takeTest", `${id}:${authUser.uid}`), {
            test: id,
            uid: authUser.uid,
            firstName: dataUser.firstName,
            lastName: dataUser.lastName,
            timestamp: serverTimestamp(),
            data: survey.data,
        })
            .then((res) => {
                getInit();
            })
            .catch((err) => {
                api.warning({
                    message: `Gặp lỗi khi tải file lên!`,
                    placement: "topRight",
                });
            });
        const docRef = doc(db, "test", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const takeUsers = Array.isArray(docSnap.data().takeUsers) ? docSnap.data().takeUsers : []
            await updateDoc(docRef, {
                takeUsers: [
                    ...takeUsers,
                    authUser.uid
                ]
            });
        }

    }
    if (!test) return (<></>)
    const surveyModel = new Survey.Model(test.data);
    surveyModel.data = takeTest?.data ?? {};
    surveyModel.mode = 'display';

    return (
        <div className="flex flex-col h-full">
            <div>
                <NavLink to={links.PATH_TEST}>
                    <Button icon={<BiArrowBack />}>
                        Back
                    </Button>
                </NavLink>
            </div>
            <div className="flex-1 overflow-y-auto">
                {
                    test.takeUsers.includes(dataUser.uid) ? <>
                            <div className="text-center p-2 text-green-500">
                                Bạn đã làm bài Test
                            </div>
                            <Button onClick={() => setViewTake(prev => !prev)}>
                                {viewTake ? 'Ẩn bài làm' : 'Hiện bài làm'}
                            </Button>
                            {(viewTake && takeTest) && <div>
                                <Survey.Survey model={surveyModel}/>
                            </div>}
                        </>
                        :
                        <Survey.Survey json={test.data} onComplete={onComplete} />
                }
            </div>
            {contextHolder}
        </div>
    )
}

export default TakeTest;