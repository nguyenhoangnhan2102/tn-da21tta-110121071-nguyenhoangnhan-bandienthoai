import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
import Profile from "./components/profile";
import UserComponent from "./pages/user";
import BrandComponent from "./pages/brand";
import ColorComponent from "./pages/color";

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
      path: "/user",
      element: <UserComponent />,
    },
    {
      path: "/brand",
      element: <BrandComponent />,
    },
    {
      path: "/color",
      element: <ColorComponent />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
