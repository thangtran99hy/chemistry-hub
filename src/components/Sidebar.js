import React from "react";
import { Layout, Menu } from "antd";
import {
    UserOutlined,
    LaptopOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import * as links from "./../routes/links";
import { SiReadthedocs } from "react-icons/si";
import { MdOutlineForum } from "react-icons/md";
import { AiOutlineVideoCamera, AiOutlineFileSearch } from "react-icons/ai";
import { HiAcademicCap } from "react-icons/hi";
import LogoIcon from "./../assets/logo.png";
// import { useNavigate } from "react-router-dom";
const { Sider } = Layout;

const Sidebar = ({ router }) => {
    const { navigate } = router;
    const menuItems = [
        {
            path: links.PATH_DOCS,
            icon: SiReadthedocs,
            text: "Tài liệu",
        },
        {
            path: links.PATH_FORUM,
            icon: MdOutlineForum,
            text: "Hỏi & Đáp",
        },
        {
            path: links.PATH_VIDEO,
            icon: AiOutlineVideoCamera,
            text: "Video",
        },
        {
            path: links.PATH_FORMULAS,
            icon: AiOutlineFileSearch,
            text: "Công thức",
        },
        {
            path: links.PATH_TEST,
            icon: HiAcademicCap,
            text: "Kiểm tra",
        },
    ];

    const onRedirect = (path) => {
        navigate(path);
    };
    console.log("router", router);
    return (
        <div className="w-[200px] bg-[#2c3145]">
            <div className="p-2">
                <img src={LogoIcon} />
            </div>
            {menuItems.map((menuItem, index) => {
                return (
                    <div
                        onClick={() => {
                            onRedirect(menuItem.path);
                        }}
                        className="flex items-center py-4 px-2 cursor-pointer text-[#7d9fb1] hover:bg-[#7d9fb1] hover:text-[#fff]"
                    >
                        <menuItem.icon className="text-md" />
                        <div className="pl-2">{menuItem.text}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
