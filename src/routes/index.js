import NotFoundPage from "../components/NotFoundPage";
import Docs from "../modules/docs";
import Formulas from "../modules/formulas";
import Forum from "../modules/forum";
import Home from "../modules/home";
import Test from "../modules/test";
import Video from "../modules/video";
import * as links from "./links";
import ForumQuestion from "../modules/forum/ForumQuestion";
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
        component: NotFoundPage,
        path: "*",
        isExact: true,
    },
];
