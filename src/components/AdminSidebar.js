import React from "react";
import * as links from "./../routes/links";
import { GrUserAdmin } from "react-icons/gr";
import { SiReadthedocs } from "react-icons/si";
import { MdOutlineForum } from "react-icons/md";
import { AiOutlineVideoCamera, AiOutlineFileSearch } from "react-icons/ai";
import { HiAcademicCap } from "react-icons/hi";
import { NavLink, useLocation } from "react-router-dom";
const AdminSidebar = (props) => {
    const location = useLocation();

    const menuItems = [
        {
            path: links.PATH_ADMIN_DOCS,
            icon: SiReadthedocs,
            text: "Tài liệu",
        },
        {
            path: links.PATH_ADMIN_VIDEO,
            icon: AiOutlineVideoCamera,
            text: "Video",
        },
        {
            path: links.PATH_ADMIN_TEST,
            icon: HiAcademicCap,
            text: "Kiểm tra",
        },
    ];
    return (
        <div className="flex items-center border-b border-b-gray-200 p-2">
            <NavLink to={links.PATH_ADMIN} className="py-1 px-5 font-bold">
                Trang quản trị
            </NavLink>
            {menuItems.map((menuItem, index) => {
                return (
                    <NavLink
                        to={menuItem.path}
                        className={`flex items-center mx-1 p-2 ${
                            menuItem.path === location.pathname
                                ? "bg-gray-200"
                                : ""
                        }`}
                    >
                        <menuItem.icon />
                        <div className="ml-1">{menuItem.text}</div>
                    </NavLink>
                );
            })}
        </div>
    );
};

export default AdminSidebar;
