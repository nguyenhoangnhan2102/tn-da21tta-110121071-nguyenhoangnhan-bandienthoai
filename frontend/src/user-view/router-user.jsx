import { useRoutes, Navigate } from "react-router-dom";
import Profile from "./profile/page";
import UserLayout from "./profile/layout";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/profile",
      element: <UserLayout />,
      children: [
        { path: "", element: <Navigate to="info" replace /> }, // default tab
        { path: "info", element: <Profile /> },
        // { path: "orders", element: <OrdersTab /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
