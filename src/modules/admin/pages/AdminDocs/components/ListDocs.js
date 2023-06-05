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
} from "firebase/firestore";
import { MdSimCardDownload } from "react-icons/md";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import TypeDocIcon from "./../../../../../assets/file_docs.svg";
import TypePdfIcon from "./../../../../../assets/file_pdf.svg";
import TypeXlsIcon from "./../../../../../assets/file_xls.svg";
import TypePptIcon from "./../../../../../assets/file_ppt.svg";
import moment from "moment";
import { Button, Popover, Col, Row } from "antd";
import {
    getFileExtension,
    handleDownload,
} from "../../../../../utils/functions";
const pageSize = 10;
const ListDocs = (props) => {
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
            ? query(
                  collection(db, "docs"),
                  where("folder", "==", folderActive),
                  orderBy("timestamp", "desc"),
                  limit(pageSize),
                  startAfter(lastDoc)
              )
            : query(
                  collection(db, "docs"),
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
        setData((prev) => ({
            ...prev,
            hasMore: items.length === pageSize,
            items: page === 1 ? items : [...prev.items, ...items],
            lastDoc: lastDocTemp,
            loading: false,
        }));
    };

    const onDownloadDoc = (doc) => {
        const storage = getStorage();
        getDownloadURL(ref(storage, doc.docPath))
            .then((url) => {
                handleDownload(
                    url,
                    `${doc.title}.${getFileExtension(doc.docPath)}`
                );
            })
            .catch((error) => {});
    };
    const onDeleteDoc = async (item) => {
        const db = getFirestore();
        await deleteDoc(doc(db, "docs", item.id));
        setData((prev) => ({
            ...prev,
            items: items.filter((itemP) => itemP.id !== item.id),
        }));
    };

    const showDocTypeIcon = (item) => {
        let icon = TypeDocIcon;
        const docType = getFileExtension(item.docPath);
        switch (docType) {
            case "doc":
            case "docx":
                icon = TypeDocIcon;
                break;
            case "pdf":
                icon = TypePdfIcon;
                break;
            case "xlsx":
            case "xls":
                icon = TypeXlsIcon;
                break;
            case "ppt":
            case "pptx":
                icon = TypePptIcon;
                break;
            default:
                break;
        }
        return icon;
    };
    const showDocItem = (item, index) => {
        return (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} className="p-2">
                <div
                    ref={index === items.length - 1 ? lastItemRef : undefined}
                    className="my-2 p-2 border rounded-xl hover:bg-gray-50"
                >
                    <img src={showDocTypeIcon(item)} />
                    <div className="text-sm">{item.title}</div>
                    <div className="py-1 flex justify-end">
                        <div
                            className="cursor-pointer"
                            onClick={() => onDownloadDoc(item)}
                        >
                            <MdSimCardDownload className="text-2xl" />
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className="font-bold mr-2 text-xs">
                            {item.firstName} {item.lastName}
                        </div>
                        <div className="italic text-xs">
                            {item.timestamp?.seconds
                                ? moment.unix(item.timestamp.seconds).calendar()
                                : ""}
                        </div>
                    </div>
                </div>
            </Col>
        );
    };
    return (
        <div className="p-2 flex-1 w-full overflow-y-auto">
            <Row>
                {items.map((item, index) => {
                    if (isDisplay) {
                        return showDocItem(item, index);
                    }
                    return (
                        <Popover
                            content={
                                <div>
                                    <Button
                                        onClick={() => {
                                            onEditDoc(item);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            onDeleteDoc(item);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            }
                        >
                            {showDocItem(item, index)}
                        </Popover>
                    );
                })}

                {loading && (
                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <div role="status" className="animate-pulse">
                            <div className="h-10 bg-gray-300 dark:bg-gray-700 max-w-[640px] mb-2.5"></div>
                            <div className="flex items-center justify-start mt-4">
                                <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default ListDocs;
