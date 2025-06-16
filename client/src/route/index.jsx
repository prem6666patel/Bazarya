import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OTPVerify from "../pages/OTPVerify";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import DashBoard from "../layout/DashBoard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import UploadProduct from "../pages/UploadProduct";
import Products from "../pages/Products";
import ProductsAdmin from "../pages/ProductsAdmin";
import AdminPermission from "../layout/AdminPermission";
import ProductList from "../pages/ProductList";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import DisplayCartItem from "../components/DisplayCartItem";
import CheckOutPage from "../pages/CheckOutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Orders from "../pages/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "OTPVerify",
        element: <OTPVerify />,
      },
      {
        path: "ResetPassword",
        element: <ResetPassword />,
      },
      {
        path: "userMenu",
        element: <UserMenuMobile />,
      },
      {
        path: "/cart",
        element: <DisplayCartItem />,
      },
      {
        path: "dashboard",
        element: <DashBoard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
          {
            path: "Category",
            element: (
              <AdminPermission>
                <Category />
              </AdminPermission>
            ),
          },
          {
            path: "subCategory",
            element: (
              <AdminPermission>
                <SubCategory />
              </AdminPermission>
            ),
          },
          {
            path: "uploadProduct",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
          {
            path: "products",
            element: (
              <AdminPermission>
                <ProductsAdmin />
              </AdminPermission>
            ),
          },
          {
            path: "orders",
            element: (
              <AdminPermission>
                <Orders />
              </AdminPermission>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductList />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "CheckOutPage",
        element: <CheckOutPage />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
    ],
  },
]);

export default router;
