import { useRoutes, Navigate } from "react-router-dom";

import Profile from "./profile/page";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Profile />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
