import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
import Profile from "./components/profile";
import UserComponent from "./pages/user";
import ProductComponent from "./pages/product";
import Manufacturer from "./pages/manufacturer";
import Order from "./pages/Order";

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
      path: "orders", // Khi vào "/admin/users" sẽ render Users
      element: <Order />,
    },
    {
      path: "/product",
      element: <ProductComponent />,
    },
    {
      path: "/manufacturer",
      element: <Manufacturer />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
