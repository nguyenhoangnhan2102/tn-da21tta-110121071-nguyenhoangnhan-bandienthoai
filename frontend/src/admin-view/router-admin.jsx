import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
import Profile from "./components/profile";
import UserComponent from "./pages/user";
import BrandComponent from "./pages/brand";
import ProductComponent from "./pages/product";

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
      path: "/product",
      element: <ProductComponent />,
    },
    {
      path: "/brand",
      element: <BrandComponent />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
