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
    startAfter,
} from "firebase/firestore";
import { GrDocumentDownload } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button } from "antd";
import {
    getFileExtension,
    handleDownload,
} from "../../../../../utils/functions";
const pageSize = 10;
const ListTest = (props) => {
    const { forceUpdate, folderActive, onClickItem } = props;
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
            ? query(
                collection(db, "test"),
                orderBy("timestamp", "desc"),
                limit(pageSize),
                startAfter(lastDoc)
            )
            : query(
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


    console.log('items',items)

    return (
        <div className="p-2 flex-1 w-full overflow-y-auto">
            {items.map((item, index) => {
                return (
                    <div
                        ref={
                            index === items.length - 1 ? lastItemRef : undefined
                        }
                        className="my-2 p-2 border-b hover:bg-gray-50"
                        onClick={() => onClickItem(item)}
                    >
                        <div className="flex">
                            <div className="flex-1">
                                <div className="text-sm">{item.data.title}</div>
                                <div className="text-xs italic">
                                    {item.data.description}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
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
                );
            })}
            {loading && (
                <div role="status" className="animate-pulse">
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 max-w-[640px] mb-2.5"></div>
                    <div className="flex items-center justify-start mt-4">
                        <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    );
};

export default ListTest;
