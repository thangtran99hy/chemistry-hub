import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    doc,
    getDoc,
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    startAfter, deleteDoc,
} from "firebase/firestore";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import {Button, Col, Modal, Popover, Row, Spin} from "antd";
import PreviewTest from "./PreviewTest";


const pageSize = 10;
const TakeTestList = (props) => {
    const { forceUpdate,isDisplay } = props;
    const {id} = useParams();
    const [data, setData] = useState({
        items: [],
        page: null,
        lastDoc: null,
        hasMore: true,
        loading: false,
    });
    const [test, setTest] = useState(null);
    const [showTakeTest, setShowTakeTest] = useState(null)
    const { loading, hasMore, items, page, lastDoc } = data;

    useEffect(() => {
        showTest()
    }, [])
    const showTest = async () => {
        try {
            const db = getFirestore();
            const testRef = doc(db, "test", id);
            const testSnap = await getDoc(testRef);
            if (testSnap.exists()) {
                setTest({
                    id: testSnap.id,
                    ...testSnap.data()
                })
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            items: [],
            page: 0,
            lastDoc: null,
            hasMore: true,
            loading: false,
        }));
    }, []);
    useEffect(() => {
        if (forceUpdate) {
            setData((prev) => ({
                ...prev,
                page: 0,
                lastDoc: null,
                hasMore: true,
                loading: false,
            }));
        }
    }, [forceUpdate]);

    const observer = useRef();
    const lastItemRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setData((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                    }));
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );
    useEffect(() => {
        if (page === null) return;
        if (page) {
            getData();
        } else {
            setData((prev) => ({
                ...prev,
                page: 1,
            }));
        }
    }, [page]);
    const getData = async () => {
        if (loading) return;
        setData((prev) => ({
            ...prev,
            loading: true,
        }));
        const db = getFirestore();
        const q = lastDoc
            ? query(
                collection(db, "takeTest"),
                where("test", "==", id),
                orderBy("timestamp", "desc"),
                limit(pageSize),
                startAfter(lastDoc)
            )
            : query(
                collection(db, "takeTest"),
                where("test", "==", id),
                orderBy("timestamp", "desc"),
                limit(pageSize)
            );
        const querySnapshot = await getDocs(q);
        let items = [];
        let lastDocTemp = null;
        querySnapshot.forEach((doc, index) => {
            items = [
                ...items,
                {
                    id: doc.id,
                    ...doc.data(),
                },
            ];
            lastDocTemp = doc;
        });
        // setQuestions(items)
        setData((prev) => ({
            ...prev,
            hasMore: items.length === pageSize,
            items: page === 1 ? items : [...prev.items, ...items],
            lastDoc: lastDocTemp,
            loading: false,
        }));
    };

    const onClickItem = (item) => {
        setShowTakeTest(item)
    }

    return (
        <div className="flex h-full">
            <div className="p-2 flex-1 overflow-y-auto">
                {test && <PreviewTest testPreview={test}/>}
            </div>
            <div className="p-2 flex-1 w-full overflow-y-auto">
                <Row>
                    {items.map((item, index) => {
                        return (
                            <Col xs={24} sm={24} md={12} lg={8} xl={6} className="p-2">
                                <div
                                    ref={
                                        index === items.length - 1 ? lastItemRef : undefined
                                    }
                                    className="my-2 p-2 border rounded-xl hover:bg-gray-50 relative overflow-hidden"
                                    onClick={() => onClickItem(item)}
                                >
                                    <div className="flex flex-col mt-2">
                                        <div className="font-bold mr-2 text-sm">
                                            {item.firstName} {item.lastName}
                                        </div>
                                        <div className="italic text-xs">
                                            {item.timestamp?.seconds
                                                ? moment
                                                    .unix(item.timestamp.seconds)
                                                    .calendar()
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
                {loading && (
                   <Spin />
                )}
            </div>
            {showTakeTest && (
                <Modal
                    open={!!showTakeTest}
                    onClose={() => {
                        setShowTakeTest(null);
                    }}
                    onCancel={() => {
                        setShowTakeTest(null);
                    }}
                    footer={null}
                    className="w-[100vw] h-[100vh top-0 bottom-0 left-0 right-0 previewTestModal"
                >
                    <div className="flex flex-col">
                        <div className="flex items-center mt-2">
                            <div className="font-bold mr-2 text-sm">
                                {showTakeTest.firstName} {showTakeTest.lastName}
                            </div>
                            <div className="italic text-xs">
                                {showTakeTest.timestamp?.seconds
                                    ? moment
                                        .unix(showTakeTest.timestamp.seconds)
                                        .calendar()
                                    : ""}
                            </div>
                        </div>
                        <PreviewTest testPreview={test} data={showTakeTest.data}/>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TakeTestList;
