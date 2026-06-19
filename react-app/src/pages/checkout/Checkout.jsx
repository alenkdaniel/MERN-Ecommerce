import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../../context/cartContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

 

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "Cash on Delivery",
  });

  const [error, setError] = useState("");


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/address", authHeader)
      .then((res) => {
        if (res.data) setForm(res.data);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.address || !form.phone) {
      setError("Please fill all details");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter valid 10 digit phone number");
      return false;
    }

    setError("");
    return true;
  };


  const saveAddress = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/address",
        form,
        authHeader
      );
    } catch {
      toast.error("Error saving address");
    }
  };

 
  const clearDetails = async () => {
    const empty = {
      name: "",
      address: "",
      phone: "",
      payment: "Cash on Delivery",
    };

    try {
      await axios.post(
        "http://localhost:5000/api/address",
        empty,
        authHeader
      );

      setForm(empty);
      toast.success("Address cleared");
    } catch {
      toast.error("Failed to clear address");
    }
  };

 
  const handleOrderAll = async () => {
    if (!validateForm()) return;

    try {
      await saveAddress();

      await axios.post(
        "http://localhost:5000/api/order",
        {
          products: cartItems,
          totalAmount,
          address: form,
        },
        authHeader
      );

      cartItems.forEach((item) => removeFromCart(item._id)); 

      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error("Order failed");
    }
  };


  const handleOrderSingleItem = async (id) => {
    if (!validateForm()) return;

    try {
      const item = cartItems.find((i) => i._id === id);
      if (!item) return;

      await saveAddress();

      await axios.post(
        "http://localhost:5000/api/order",
        {
          products: [item],
          totalAmount: item.price * item.qty,
          address: form,
        },
        authHeader
      );

      removeFromCart(id);

      toast.success("Product ordered successfully!");
      navigate("/orders");
    } catch {
      toast.error("Order failed");
    }
  };

  if (!form || !Array.isArray(cartItems)) return null;

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Secure Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty</p>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-form">
            <h3>Shipping Details</h3>

            {error && <p className="error-msg">{error}</p>}

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <option>Cash on Delivery</option>
              <option>UPI Payment</option>
              <option>Card Payment</option>
            </select>

            <Button variant="danger" onClick={clearDetails}>
              Clear Saved Details
            </Button>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <div>
                  <h5>{item.name}</h5>
                  <p>
                    ₹{item.price} × {item.qty}
                  </p>
                </div>

                <strong>₹{item.price * item.qty}</strong>

                <Button
                  variant="success"
                  onClick={() => handleOrderSingleItem(item._id)}
                >
                  Buy Now
                </Button>
              </div>
            ))}

            <div className="summary-row">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            <Button className="place-order-btn" onClick={handleOrderAll}>
              Order All Items
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;