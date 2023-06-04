import NotFoundPage from "../components/NotFoundPage";
import Docs from "../modules/docs";
import Formulas from "../modules/formulas";
import Forum from "../modules/forum";
import Home from "../modules/home";
import Test from "../modules/test";
import Video from "../modules/video";
import * as links from "./links";
import ForumQuestion from "../modules/forum/ForumQuestion";
import Admin from "../modules/admin";
import AdminDocs from "../modules/admin/pages/AdminDocs";
import AdminVideo from "../modules/admin/pages/AdminVideo";
import AdminTest from "../modules/admin/pages/AdminTest";
import TakeTest from "../modules/test/components/TakeTest";
export const mainRoutes = [
    {
        component: Home,
        path: links.PATH_HOME,
        isExact: true,
    },
    {
        component: Docs,
        path: links.PATH_DOCS,
        isExact: true,
    },
    {
        component: Forum,
        path: links.PATH_FORUM,
        isExact: true,
    },
    {
        component: ForumQuestion,
        path: links.PATH_FORUM_QUESTION,
        isExact: true,
    },
    {
        component: Video,
        path: links.PATH_VIDEO,
        isExact: true,
    },
    {
        component: Formulas,
        path: links.PATH_FORMULAS,
        isExact: true,
    },
    {
        component: Test,
        path: links.PATH_TEST,
        isExact: true,
    },
    {
        component: TakeTest,
        path: links.PATH_TAKE_TEST,
        isExact: true
    },
    {
        component: Admin,
        path: links.PATH_ADMIN,
        isExact: true,
        isAdmin: true,
    },
    {
        component: AdminDocs,
        path: links.PATH_ADMIN_DOCS,
        isExact: true,
        isAdmin: true,
    },
    {
        component: AdminVideo,
        path: links.PATH_ADMIN_VIDEO,
        isExact: true,
        isAdmin: true,
    },
    {
        component: AdminTest,
        path: links.PATH_ADMIN_TEST,
        isExact: true,
        isAdmin: true,
    },
    {
        component: NotFoundPage,
        path: "*",
        isExact: true,
    },
];
