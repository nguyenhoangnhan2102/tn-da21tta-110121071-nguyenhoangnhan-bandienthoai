import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        // Lưu lại route hiện tại
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};
