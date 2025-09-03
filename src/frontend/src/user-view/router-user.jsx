import { useRoutes, Navigate } from "react-router-dom";

import Profile from "./profile/page";
import Orders from "../web-view/page/Order";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "", // tương đương "/user"
      element: <Profile />,
    },
    {
      path: "history-order",
      element: <Orders />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
