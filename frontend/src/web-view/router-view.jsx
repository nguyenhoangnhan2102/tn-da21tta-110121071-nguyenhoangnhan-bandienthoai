import { useRoutes, Navigate } from "react-router-dom";

import Login from "../share/login";
import Register from "../share/register";
import Home from "./page/Home";
import ProductDetails from "./page/Details";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/product-details/:masanpham",
      element: <ProductDetails />,
    },
    // {
    //   path: "/profile",
    //   element: <Profile />,
    // },
    // {
    //   path: "/cart",
    //   element: <Cart />,
    // },
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
