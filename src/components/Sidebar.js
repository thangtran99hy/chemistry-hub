import React, { useContext } from "react";
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
import { useLocation, NavLink } from "react-router-dom";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "./../firebase";

const Sidebar = (props) => {
    const { authUser, isAuthModal, setAuthUser, setIsAuthModal } =
        useContext(AuthContext);
    const onSignOut = () => {
        signOut(auth).then((res) => {
            setAuthUser(null);
        });
    };
    const location = useLocation();
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

    console.log("location", location);
    return (
        <div className="w-[200px] bg-[#2c3145] flex flex-col">
            <div className="p-2">
                <NavLink to={links.PATH_HOME}>
                    <img src={LogoIcon} />
                </NavLink>
            </div>
            <div className="flex-1">
                {menuItems.map((menuItem, index) => {
                    const isActive = location.pathname === menuItem.path;
                    return (
                        <NavLink to={menuItem.path}>
                            <div
                                className={`flex items-center py-4 px-2 cursor-pointer  ${
                                    isActive
                                        ? "text-[#fff] bg-[#7d9fb1]"
                                        : "text-[#7d9fb1] "
                                }`}
                            >
                                <menuItem.icon className="text-md" />
                                <div className="pl-2">{menuItem.text}</div>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
            {authUser ? (
                <div
                    className="p-2 h-[50px] text-white flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        onSignOut();
                    }}
                >
                    <FaSignOutAlt />
                    <div className="ml-2">Sign Out</div>
                </div>
            ) : (
                <div
                    className="p-2 h-[50px] text-white flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setIsAuthModal(true);
                    }}
                >
                    <FaSignInAlt />
                    <div className="ml-2">Sign In</div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
