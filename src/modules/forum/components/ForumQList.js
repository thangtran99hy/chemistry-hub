import React, {useCallback, useEffect, useRef, useState} from "react";
import {doc, getDoc, getFirestore, collection, query, where, getDocs, orderBy, limit, startAfter} from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {Spin} from "antd";
const pageSize = 10;
const ForumQList = (props) => {
    const {
        forceUpdate
    } = props;
    const navigate = useNavigate();
    const [data, setData] = useState({
        items: [],
        page: 0,
        lastDoc: null,
        hasMore: true,
        loading: false
    })
    const {
        loading,
        hasMore,
        items,
        page,
        lastDoc
    } = data;

    useEffect(() => {
        if (forceUpdate) {
            setData(prev => ({
                ...prev,
                page: 0,
                lastDoc: null,
                hasMore: true,
                loading: false
            }))
        }
    }, [forceUpdate])

    const observer = useRef()
    const lastItemRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setData(prev => ({
                    ...prev,
                    page: prev.page + 1
                }))
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])
    useEffect(() => {
        if (page) {
            getData();
        } else {
            setData(prev => ({
                ...prev,
                page: 1
            }))
        }
    }, [page])
    const getData = async () => {
        if (loading) return;
        setData(prev => ({
            ...prev,
            loading: true
        }))
        const db = getFirestore();
        const q = lastDoc ? query(collection(db, "forumQuestions"), orderBy('timestamp', 'desc'), limit(pageSize), startAfter(lastDoc)) : query(collection(db, "forumQuestions"), orderBy('timestamp', 'desc'), limit(pageSize));
        const querySnapshot = await getDocs(q);
        let items = []
        let lastDocTemp = null;
        querySnapshot.forEach((doc, index) => {
            items = [...items, {
                id: doc.id,
                ...doc.data()
            }]
            lastDocTemp = doc;
        });
        // setQuestions(items)
        setData(prev => ({
            ...prev,
            hasMore: items.length === pageSize,
            items: page === 1 ? items : [...prev.items, ...items],
            lastDoc: lastDocTemp,
            loading: false
        }))
    }

    const onGoToFormQuestion = (question) => {
        navigate(question.id)
    }
    return (
        <div className="p-2 flex-1 overflow-y-auto">
            {
                items.map((question, index) => {
                    return (
                        <div
                            ref={index === items.length - 1 ? lastItemRef : undefined}
                            className="cursor-pointer my-2 p-2 border-b hover:bg-gray-50" onClick={() => {
                            onGoToFormQuestion(question)
                        }}>
                            <div className="text-sm" dangerouslySetInnerHTML={{__html: question.content}}></div>
                           <div className="flex items-center mt-2">
                               <div className="font-bold mr-2 text-sm">{question.firstName} {question.lastName}</div>
                               <div className="italic text-xs">{question.timestamp?.seconds ? moment.unix(question.timestamp.seconds).calendar() : ''}</div>
                           </div>
                        </div>
                    )
                })
            }
            {
                loading && <Spin />
            }
        </div>
    );
};

export default ForumQList;
