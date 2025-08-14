import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// Tạo context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []); // Chỉ chạy khi component được mount

    const loginIs = () => {
        setIsLoggedIn(true);
    };

    const logoutIs = () => {
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loginIs, logoutIs }}>
            {children}
        </AuthContext.Provider>
    );
};


// Hook để sử dụng context
export const useAuth = () => {
    return useContext(AuthContext);
};
