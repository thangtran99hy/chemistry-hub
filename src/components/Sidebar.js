import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import * as links from "./../routes/links";
import { SiReadthedocs } from "react-icons/si";
import { MdOutlineForum } from "react-icons/md";
import { AiOutlineVideoCamera, AiOutlineFileSearch } from "react-icons/ai";
import { HiAcademicCap } from "react-icons/hi";
import LogoIcon from "./../assets/logo.png";
import {useLocation, NavLink, useMatch} from "react-router-dom";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "./../firebase";
import { RiAdminLine } from "react-icons/ri";
const Sidebar = (props) => {
    const { authUser, isAuthModal, dataUser, setAuthUser, setIsAuthModal } =
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
        ...(dataUser?.isAdmin
            ? [
                  {
                      path: links.PATH_ADMIN,
                      icon: RiAdminLine,
                      text: "Admin",
                  },
              ]
            : []),
    ];
    const listPathAdmin = [
        links.PATH_ADMIN,
        links.PATH_ADMIN_DOCS,
        links.PATH_ADMIN_TEST,
        links.PATH_ADMIN_VIDEO,
    ];

    const matchAdminTakeTest = useMatch(links.PATH_ADMIN_TAKE_TEST);
    const isAdminTakeList = matchAdminTakeTest?.pathname === location.pathname;

    const matchTakeTest = useMatch(links.PATH_TAKE_TEST);
    const isTakeTest = matchTakeTest?.pathname === location.pathname;

    const matchForumQuestion = useMatch(links.PATH_FORUM_QUESTION);
    const isForumQuestion = matchForumQuestion?.pathname === location.pathname;

    return (
        <div className="w-[200px] bg-[#2c3145] flex flex-col">
            <div className="p-2">
                <NavLink to={links.PATH_HOME}>
                    <img src={LogoIcon} />
                </NavLink>
            </div>
            <div className="flex-1">
                {menuItems.map((menuItem, index) => {
                    const isActive =
                        location.pathname === menuItem.path ||
                        (menuItem.path === links.PATH_ADMIN &&
                            (listPathAdmin.includes(location.pathname)|| isAdminTakeList)) || (menuItem.path === links.PATH_TEST && isTakeTest) || (menuItem.path === links.PATH_FORUM && isForumQuestion);
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
                    <div className="ml-2">Đăng xuất</div>
                </div>
            ) : (
                <div
                    className="p-2 h-[50px] text-white flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setIsAuthModal(true);
                    }}
                >
                    <FaSignInAlt />
                    <div className="ml-2">Đăng nhập</div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
