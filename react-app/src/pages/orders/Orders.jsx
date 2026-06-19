import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Orders.css";

const Orders = () => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("ORDERS RESPONSE:", res.data);

        // ✅ FIX HERE
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (err) {
        console.log(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>Please login</div>;
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            <h4>Order #{order._id.slice(-6)}</h4>

            <p>
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* PRODUCTS */}
            <div className="order-products">
              {(order.products || []).map((item, index) => (
                <div key={index} className="order-item">
                  <p>{item.name}</p>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* STATUS */}
            <p className="order-status">
              Status: <strong>{order.status}</strong>
            </p>

            {/* TOTAL */}
            <h5>Total: ₹{order.totalAmount}</h5>

          </div>
        ))
      )}
    </div>
  );
};

export default Orders;