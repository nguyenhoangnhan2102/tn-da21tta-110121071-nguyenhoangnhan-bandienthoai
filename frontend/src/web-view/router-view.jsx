import { useRoutes, Navigate } from "react-router-dom";

import Login from "../share/login";
import Register from "../share/register";
import Home from "./page/Home";
import ProductDetails from "./page/Details";
import Cart from "./page/Cart";
import Orders from "./page/Order";

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
    {
      path: "/cart",
      element: <Cart />,
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
