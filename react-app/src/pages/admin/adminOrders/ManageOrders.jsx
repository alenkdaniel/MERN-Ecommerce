import React, { useContext } from "react";
import { OrdersContext } from "../../../context/ordersContext";
import "./ManageOrders.css";

const ManageOrders = () => {
  const { orders, updateOrderStatus } = useContext(OrdersContext);

  return (
    <div className="admin-orders-page">
      <h2 className="title">Manage Orders</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="admin-order-card">

           
            <div className="order-top">
              <div className="order-info">
                <p className="order-id">
                  <strong>Order ID:</strong> {order._id}
                </p>

                <p className="order-user">
                  <strong>User:</strong>{" "}
                  {order.userId?.name || "Unknown"} (
                  {order.userId?.email || "No email"})
                </p>

                <p className="order-date">
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

          
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(order._id, e.target.value)
                }
                className={`status-select ${order.status?.toLowerCase()}`}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="order-items">
              {order.products.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-left">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-img"
                      />
                    )}
                    <span className="item-name">{item.name}</span>
                  </div>

                  <div className="item-right">
                    ₹{item.price} × {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <strong>Total:</strong> ₹{order.totalAmount}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrders;