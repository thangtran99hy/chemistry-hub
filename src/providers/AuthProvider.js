import { createContext, useState } from "react";

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(undefined);
    const [isAuthModal, setIsAuthModal] = useState(false);
    const contextData = {
        authUser,
        setAuthUser,
        isAuthModal,
        setIsAuthModal,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
