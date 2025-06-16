import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import GlobalProvider from "./provider/GlobalProvider";

function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // 👈 get current path

  // List of routes where Header should be hidden
  const hideHeaderRoutes = ["/cart"];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        if (token) {
          try {
            const userdata = await fetchUserDetails();
            dispatch(setUserDetails(userdata.data));
          } catch (error) {
            console.error("Fetch User Error:", error);
          }
        }

        dispatch(setLoadingCategory(true));
        const categoryResponse = await axios.get(
          "https://bazarya-theta.vercel.app/api/category/get",
          { headers }
        );
        if (categoryResponse.data.success) {
          dispatch(setAllCategory(categoryResponse.data.data));
          dispatch(setLoadingCategory(false));
        }

        const subCategoryResponse = await axios.post(
          "https://bazarya-theta.vercel.app/api/subCategory/get",
          null,
          { headers }
        );
        if (subCategoryResponse.data.success) {
          dispatch(setAllSubCategory(subCategoryResponse.data.data));
        }

      } catch (error) {
        console.error("Data Fetching Error:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <GlobalProvider>
      {/* 👇 Conditionally show Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <main className="min-h-[80vh]">
        <Outlet />
      </main>

      <Footer />
      <Toaster />
    </GlobalProvider>
  );
}

export default App;
