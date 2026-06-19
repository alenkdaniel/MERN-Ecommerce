import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const { currentUser, token } = useContext(AuthContext); // ✅ use token from context
  const [orders, setOrders] = useState([]);

  const isAdmin = currentUser?.role === "admin";

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const url = isAdmin
        ? "http://localhost:5000/api/admin/orders"
        : "http://localhost:5000/api/orders";

      console.log("Fetching from:", url);

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ORDERS DATA:", data);

      if (data.success) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("FETCH ERROR:", error.response?.data || error.message);
      setOrders([]);
    }
  };


  const addOrder = async (products, totalAmount, address) => {
    try {
      await axios.post(
        "http://localhost:5000/api/order",
        {
          products,
          totalAmount,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders(); 
    } catch (error) {
      console.log("ADD ORDER ERROR:", error.response?.data || error.message);
    }
  };


  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders(); 
    } catch (error) {
      console.log("UPDATE ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (currentUser && token) {
      fetchOrders();
    }
  }, [currentUser, token]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        fetchOrders, 
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;