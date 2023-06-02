import { createContext, useEffect, useState } from "react";
import { getDatabase, ref, child, get } from "firebase/database";

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(undefined);
    const [dataUser, setDataUser] = useState(null);
    const [isAuthModal, setIsAuthModal] = useState(false);

    useEffect(() => {
        if (authUser) {
            setIsAuthModal(false);
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users/${authUser.uid}`))
                .then((snapshot) => {
                    setDataUser({
                        ...snapshot.val(),
                        uid: authUser.uid,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setDataUser(null);
        }
    }, [authUser]);
    const contextData = {
        authUser,
        setAuthUser,
        isAuthModal,
        setIsAuthModal,
        dataUser,
        setDataUser,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
