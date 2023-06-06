import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
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
import {FiUsers} from "react-icons/fi";
import * as links from "./../../../../../routes/links"
import {AuthContext} from "../../../../../providers/AuthProvider";
const pageSize = 10;
const ListTest = (props) => {
    const { dataUser } =
        useContext(AuthContext)
    const { forceUpdate, folderActive, onClickItem,isDisplay,onEditDoc } = props;
    const navigate = useNavigate();
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
                collection(db, "test"),
                where("isHide", "!=", true),
                orderBy("isHide", "asc"),
                orderBy("timestamp", "desc"),
                limit(pageSize),
                startAfter(lastDoc)
            ) : query(
                collection(db, "test"),
                orderBy("timestamp", "desc"),
                limit(pageSize),
                startAfter(lastDoc)
            )
            : isDisplay ? query(
                collection(db, "test"),
                where("isHide", "!=", true),
                orderBy("isHide", "asc"),
                orderBy("timestamp", "desc"),
                limit(pageSize)
            ) : query(
                collection(db, "test"),
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
        await deleteDoc(doc(db, "test", item.id));
        setData((prev) => ({
            ...prev,
            items: items.filter((itemP) => itemP.id !== item.id),
        }));
    };

    const goToTakeList = (item) => {
        navigate(links.PATH_ADMIN_TAKE_TEST.replace(':id', item.id))
    }

    return (
        <div className="p-2 flex-1 w-full overflow-y-auto">
            <Row>
            {items.map((item, index) => {
                const takeUsers = Array.isArray(item.takeUsers) ? item.takeUsers : []
                return (
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} className="p-2">
                    <div
                        ref={
                            index === items.length - 1 ? lastItemRef : undefined
                        }
                        className={`my-2 p-2 border rounded-xl relative overflow-hidden ${(isDisplay && takeUsers.includes(dataUser.uid)) ? 'bg-green-400' : 'hover:bg-gray-50'}`}
                        onClick={() => onClickItem(item)}
                    >
                        <div className="flex">
                            <div className="flex-1">
                                <div className="text-sm">{item.data.title}</div>
                                <div className="text-xs italic">
                                    {item.data.description}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-1 font-bold text-xs">{takeUsers.length}</div>
                                <FiUsers />
                            </div>
                        </div>
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
                            {(!isDisplay) && <Popover
                                content={
                                    <div className="flex flex-col items-center">
                                        {
                                            takeUsers.length === 0
                                            ?
                                        <>
                                            <Button
                                                className="my-1 w-full"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onEditDoc(item);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                className="my-1 w-full"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onDeleteDoc(item);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                                :
                                                <>
                                                    <Button
                                                        className="my-1 w-full"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            goToTakeList(item);
                                                        }}
                                                    >
                                                        List take
                                                    </Button>
                                                </>
                                        }
                                    </div>
                                }
                                // trigger="click"
                            >
                                <div className="cursor-pointer z-10" onClick={(event) => {
                                    event.stopPropagation();
                                }}>
                                    <FaEllipsisV className="text-sm" />
                                </div>
                            </Popover>}
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

export default ListTest;
