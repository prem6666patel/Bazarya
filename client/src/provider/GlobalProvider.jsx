import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import { toast } from "react-hot-toast";
import { handleAddaddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import { setAllOrders } from "../store/allOrdersSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [notDisCountPrice, setNotDisCountPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartItem = useSelector((state) => state?.cartItem?.cart || []);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const qty = cartItem.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
    setTotalQty(qty);

    const tprice = cartItem.reduce(
      (prev, curr) =>
        prev +
        (curr.productId?.price - curr?.productId?.discount || 0) *
          (curr.quantity || 0),
      0
    );
    setTotalPrice(tprice);

    const notDiscountPrice = cartItem.reduce((preve, curr) => {
      return preve + curr?.productId?.price * curr.quantity;
    }, 0);
    setNotDisCountPrice(notDiscountPrice);
  }, [cartItem]);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get("https://bazarya-theta.vercel.app/api/cart/get", {
        headers,
      });

      if (response.data.success) {
        dispatch(handleAddItemCart(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        "https://bazarya-theta.vercel.app/api/cart/update-qty",
        { _id: id, qty },
        { headers }
      );

      if (response.data.success) {
        fetchCartItems();
        toast.success(response.data.message || "Quantity updated!");
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(
        "https://bazarya-theta.vercel.app/api/cart/deleteCartItem",
        {
          headers,
          data: { _id: cartId },
        }
      );

      if (response.data.success) {
        fetchCartItems();
        toast.success(response.data.message || "Item removed from cart!");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        "https://bazarya-theta.vercel.app/api/address/get",
        {
          headers,
        }
      );

      if (response.data.success) {
        console.log("Address fetched successfully:", response.data);
        dispatch(handleAddaddress(response.data.data));
      } else {
        console.error("Failed to fetch address:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetchAddress:", error.message || error);
    }
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        "https://bazarya-theta.vercel.app/api/order/getOrderDetails",
        {
          headers,
        }
      );

      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      } else {
        console.error("Failed to fetch address:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetchOrder:", error.message || error);
    }
  };

  const fetchAllOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        "https://bazarya-theta.vercel.app/api/order/getAllOrderDetails",
        {
          headers,
        }
      );

      if (response.data.success) {
        dispatch(setAllOrders(response.data.data));
      } else {
        console.error("Failed to fetch address:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetchOrder:", error.message || error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAddress();
    fetchOrder();
    fetchAllOrder();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        fetchAllOrder,
        notDisCountPrice,
        totalPrice,
        totalQty,
      }}
    >
      {!loading && children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
