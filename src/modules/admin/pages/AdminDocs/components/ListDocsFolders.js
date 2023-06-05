import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    doc,
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    startAfter,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import {Button, Popover, Spin} from "antd";
import { FaEllipsisV } from "react-icons/fa";

const pageSize = 20;
const ListDocsFolders = (props) => {
    const {
        forceUpdate,
        onclickFolder,
        folderActive,
        onEditFolder,
        isDisplay,
    } = props;
    const [data, setData] = useState({
        items: [],
        page: 0,
        lastDoc: null,
        hasMore: true,
        loading: false,
    });
    const { loading, hasMore, items, page, lastDoc } = data;

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
                  collection(db, "docFolders"),
                  orderBy("timestamp", "desc"),
                  limit(pageSize),
                  startAfter(lastDoc)
              )
            : query(
                  collection(db, "docFolders"),
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
        setData((prev) => ({
            ...prev,
            hasMore: items.length === pageSize,
            items: page === 1 ? items : [...prev.items, ...items],
            lastDoc: lastDocTemp,
            loading: false,
        }));
    };

    const onDeleteFolder = async (item) => {
        const db = getFirestore();
        await deleteDoc(doc(db, "docFolders", item.id));
        setData((prev) => ({
            ...prev,
            items: items.filter((itemP) => itemP.id !== item.id),
        }));
        await moveDocsInFolderToMain(item);
    };

    const moveDocsInFolderToMain = async (item) => {
        const db = getFirestore();
        const q = query(collection(db, "docs"), where("folder", "==", item.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docItem, index) => {
            try {
                updateDoc(doc(db, "docs", docItem.id), {
                    folder: null,
                });
            } catch (e) {}
        });
        if (folderActive === item.id) onclickFolder(null);
    };

    return (
        <div
            className="p-2 flex-1 w-full overflow-y-auto"
            style={{
                height: "calc(100% - 50px)",
            }}
        >
            <div
                className={`my-2 p-2 border-b hover:bg-gray-300 cursor-pointer ${
                    folderActive === null ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                    onclickFolder(null);
                }}
            >
                <div className="text-sm">Main</div>
            </div>
            {items.map((item, index) => {
                return (
                    <div
                        onClick={() => {
                            onclickFolder(item.id);
                        }}
                        ref={
                            index === items.length - 1 ? lastItemRef : undefined
                        }
                        className={`flex items-center my-2 p-1 border-b hover:bg-gray-300 cursor-pointer ${
                            folderActive === item.id ? "bg-gray-300" : ""
                        }`}
                    >
                        <div className="flex-1 text-sm">{item.name}</div>
                        {!isDisplay && (
                            <Popover
                                content={
                                    <div className="flex flex-col items-center">
                                        <Button
                                            className="my-1 w-full"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onEditFolder(item);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="my-1 w-full"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onDeleteFolder(item);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                }
                                // trigger="click"
                            >
                                <div
                                    className="cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                >
                                    <FaEllipsisV className="text-xs" />
                                </div>
                            </Popover>
                        )}
                    </div>
                );
            })}
            {loading && (
                <Spin />
            )}
        </div>
    );
};

export default ListDocsFolders;
