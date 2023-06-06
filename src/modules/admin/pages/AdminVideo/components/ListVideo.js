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
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {Button, Col, Popover, Row, Spin} from "antd";
import {FaEllipsisV} from "react-icons/fa";
const pageSize = 10;
const ListVideo = (props) => {
    const { forceUpdate, folderActive, onEditDoc, isDisplay } = props;
    const [data, setData] = useState({
        items: [],
        page: null,
        lastDoc: null,
        hasMore: true,
        loading: false,
    });
    const { loading, hasMore, items, page, lastDoc } = data;

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            items: [],
            page: 0,
            lastDoc: null,
            hasMore: true,
            loading: false,
        }));
    }, [folderActive]);
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
            ? isDisplay ? query(
                  collection(db, "video"),
                  where("folder", "==", folderActive),
                    where("isHide", "!=", true),
                    orderBy("isHide", "asc"),
                  orderBy("timestamp", "desc"),
                  limit(pageSize),
                  startAfter(lastDoc)
              ) : query(
                collection(db, "video"),
                where("folder", "==", folderActive),
                orderBy("timestamp", "desc"),
                limit(pageSize),
                startAfter(lastDoc)
            )
            : isDisplay ? query(
                  collection(db, "video"),
                  where("folder", "==", folderActive),
                where("isHide", "!=", true),
                orderBy("isHide", "asc"),
                  orderBy("timestamp", "desc"),
                  limit(pageSize)
              ) : query(
                collection(db, "video"),
                where("folder", "==", folderActive),
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

    const onDeleteDoc = async (item) => {
        const db = getFirestore();
        await deleteDoc(doc(db, "video", item.id));
        setData((prev) => ({
            ...prev,
            items: items.filter((itemP) => itemP.id !== item.id),
        }));
    };

    return (
        <div className="p-2 flex-1 w-full overflow-y-auto">
            <Row>
                {items.map((item, index) => {
                    return (
                        <Col xs={24} sm={24} md={24} lg={12} xl={8} className="p-2">
                            <div
                                ref={
                                    index === items.length - 1
                                        ? lastItemRef
                                        : undefined
                                }
                                className="h-full my-2 pb-2 border rounded-xl hover:bg-gray-50 relative overflow-hidden"
                            >
                                <div>
                                    <img
                                        src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
                                    />
                                </div>
                                <div className="p-2">
                                    <div className="text-sm">{item.title}</div>
                                    <div className="flex items-center mt-2">
                                        <div className="flex-1 flex items-center">
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
                                        {!isDisplay && <div>
                                            <Popover
                                                content={
                                                    <div className="flex flex-col items-center">
                                                        <Button
                                                            className="my-1 w-full"
                                                            onClick={() => {
                                                                onEditDoc(item);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            className="my-1 w-full"
                                                            onClick={() => {
                                                                onDeleteDoc(item);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                }
                                                // trigger="click"
                                            >
                                                <div className="cursor-pointer z-10">
                                                    <FaEllipsisV className="text-sm" />
                                                </div>
                                            </Popover>
                                        </div>}
                                    </div>
                                </div>
                                {!!item.isHide && (
                                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#ffffff99]"></div>
                                )}
                            </div>
                        </Col>
                    );
                })}
            </Row>
            {loading && (
               <Spin />
            )}
        </div>
    );
};

export default ListVideo;
