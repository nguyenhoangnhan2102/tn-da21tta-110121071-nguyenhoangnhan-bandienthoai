import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
import Profile from "./components/profile";

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardAdmin />,
    },

    {
      path: "/profile",
      element: <Profile />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
