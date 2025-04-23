import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import Login from "../share/login";
import Register from "../share/register";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
