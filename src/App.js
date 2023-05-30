import "./App.css";
import Sidebar from "./components/Sidebar";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import { mainRoutes } from "./routes";
import NotFoundPage from "./components/NotFoundPage";

function App() {
    const router = createBrowserRouter(
        mainRoutes.map((route, index) => {
            const {
                component: ComponentRoute,
                path,
                isExact,
                isPrivate,
                isAdmin,
            } = route;
            return {
                path: path,
                element: <ComponentRoute />,
                // isExact: isExact,
            };
        })
    );
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <RouterProvider router={router} />
            </div>
        </div>
    );
}

export default App;
