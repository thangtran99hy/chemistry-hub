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
import Auth from "./modules/auth";
import LayoutAdmin from "./components/LayoutAdmin";

const App = (props) => {
    const { authUser, isAuthModal, setAuthUser, setIsAuthModal, dataUser } =
        useContext(AuthContext);
    console.log("dataUser", dataUser);
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
        mainRoutes
            .map((route, index) => {
                const {
                    component: ComponentRoute,
                    path,
                    isExact,
                    isPrivate,
                    isAdmin,
                } = route;
                if (!dataUser?.isAdmin && isAdmin) {
                    return undefined;
                }
                return {
                    path: path,
                    element: (
                        <LayoutApp>
                            {isAdmin ? (
                                <LayoutAdmin>
                                    <ComponentRoute />
                                </LayoutAdmin>
                            ) : (
                                <ComponentRoute />
                            )}
                        </LayoutApp>
                    ),
                    // isExact: isExact,
                };
            })
            .filter((item) => !!item)
    );
    if (authUser === undefined || (authUser && !dataUser)) return <></>;
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
                    footer={null}
                >
                    <Auth />
                </Modal>
            )}
        </>
    );
};

export default App;
