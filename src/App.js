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
import LayoutApp from "./components/LayoutApp";
import { useContext, useEffect } from "react";
import { AuthContext } from "./providers/AuthProvider";
import { Modal } from "antd";
import SignUp from "./modules/auth/components/SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = (props) => {
    const { authUser, isAuthModal, setAuthUser, setIsAuthModal } =
        useContext(AuthContext);
    console.log("authUser", authUser);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
    }, []);
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
                element: (
                    <LayoutApp>
                        <ComponentRoute />
                    </LayoutApp>
                ),
                // isExact: isExact,
            };
        })
    );
    if (authUser === undefined) return <></>;
    return (
        <>
            <RouterProvider router={router} />
            {isAuthModal && (
                <Modal
                    open={isAuthModal}
                    onCancel={() => {
                        setIsAuthModal(false);
                    }}
                    onClose={() => {
                        setIsAuthModal(false);
                    }}
                >
                    <SignUp />
                </Modal>
            )}
        </>
    );
};

export default App;
