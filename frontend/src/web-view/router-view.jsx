import { useRoutes, Navigate } from "react-router-dom";

import Login from "../share/login";
import Register from "../share/register";
import Home from "./page/Home";
import ProductDetails from "./page/Details";
import Cart from "./page/Cart";
import Orders from "./page/Order";
import Checkout from "./page/Checkout";
import MomoReturn from "./page/MomoReturn";

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
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/momo-return",
      element: <MomoReturn />,
    },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
