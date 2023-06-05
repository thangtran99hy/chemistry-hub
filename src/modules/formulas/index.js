import React, { useCallback, useEffect, useRef, useState } from "react";
import { delay } from "../../utils/functions";
import { Input, Spin } from "antd";
import _ from "lodash";

const pageSize = 20;
const Formulas = (props) => {
    const [formulas, setFormulas] = useState(require("./formula.json"));
    const [data, setData] = useState({
        items: [],
        page: null,
        lastDoc: null,
        hasMore: true,
        loading: false,
        searchText: "",
    });
    const [searchInput, setSearchInput] = useState("");
    const { loading, hasMore, items, page, searchText } = data;
    useEffect(() => {
        const delayTimer = setTimeout(() => {
            setData((prev) => ({
                ...prev,
                items: [],
                page: 0,
                hasMore: true,
                loading: false,
                searchText: searchInput,
            }));
        }, 500);

        return () => {
            clearTimeout(delayTimer);
        };
    }, [searchInput]);

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

    // useEffect(() => {
    //     setData((prev) => ({
    //         ...prev,
    //         page: 0,
    //     }));
    // }, [searchText]);
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
        await delay(1000);

        let lastDocTemp = null;

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchTextLower = searchText.toLowerCase();
        const formulasFilter =
            searchText.trim() === ""
                ? formulas
                : formulas.filter((item) => {
                      return (
                          item.formula
                              .toLowerCase()
                              .replaceAll("<sub>", "")
                              .replaceAll("</sub>", "")
                              .indexOf(searchTextLower) === 0
                          //   || item.name.toLowerCase().indexOf(searchTextLower) === 0
                      );
                  });
        const items = formulasFilter.slice(startIndex, endIndex);
        setData((prev) => ({
            ...prev,
            hasMore: items.length === pageSize,
            items: page === 1 ? items : [...prev.items, ...items],
            lastDoc: lastDocTemp,
            loading: false,
        }));
    };

    return (
        <div className="p-2 flex-1 w-full flex flex-col h-full overflow-hidden">
            <div className="p-2 pt-0">
                <Input.Search
                    placeholder="Enter your search query"
                    onChange={(event) => setSearchInput(event.target.value)}
                    enterButton
                    value={searchInput}
                />
            </div>
            <div className="overflow-y-auto flex-1">
                {items.map((item, index) => {
                    return (
                        <div
                            ref={
                                index === items.length - 1
                                    ? lastItemRef
                                    : undefined
                            }
                            className="my-2 p-2 border-b hover:bg-gray-50"
                        >
                            <div className="flex">
                                <div className="flex-1">
                                    <div
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: item.formula,
                                        }}
                                    />
                                    <div className="text-xs italic">
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="flex justify-center items-center p-2">
                        <Spin />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Formulas;
