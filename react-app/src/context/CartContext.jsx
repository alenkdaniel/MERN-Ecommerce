import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { currentUser, authLoading, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // ✅ use token from context
  const getAuthHeader = () => {
    if (!token) return null;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCart = async () => {
    if (!token) return; 
    try {
      console.log("CART TOKEN:", token);

      const res = await axios.get(
        "http://localhost:5000/api/cart",
        getAuthHeader()
      );

      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Cart fetch error", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser || !token) return;

    fetchCart();
  }, [currentUser, authLoading, token]);

  const addToCart = async (product) => {
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { product },
        getAuthHeader()
      );
      fetchCart();
    } catch (err) {
      console.error("Add to cart error", err.response?.data);
    }
  };

  const incQty = async (id) => {
    if (!token) return;

    try {
      const item = cartItems.find((i) => i.productId === id);
      if (!item) return;

      await axios.put(
        "http://localhost:5000/api/cart",
        { productId: id, qty: item.qty + 1 },
        getAuthHeader()
      );

      fetchCart();
    } catch (err) {
      console.error("Inc qty error", err.response?.data);
    }
  };

  const decQty = async (id) => {
    if (!token) return;

    try {
      const item = cartItems.find((i) => i.productId === id);
      if (!item || item.qty <= 1) return;

      await axios.put(
        "http://localhost:5000/api/cart",
        { productId: id, qty: item.qty - 1 },
        getAuthHeader()
      );

      fetchCart();
    } catch (err) {
      console.error("Dec qty error", err.response?.data);
    }
  };

  const removeFromCart = async (id) => {
    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/cart/${id}`,
        getAuthHeader()
      );
      fetchCart();
    } catch (err) {
      console.error("Remove error", err.response?.data);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incQty,
        decQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;