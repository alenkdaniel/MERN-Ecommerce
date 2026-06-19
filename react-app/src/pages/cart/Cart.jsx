import React, { useContext, useEffect } from "react";
import { CartContext } from "../../context/cartContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Cart.css";

const Cart = () => {
  const { cartItems, incQty, decQty, removeFromCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-wrapper">
      <div className="cart-top">
        <Button onClick={() => navigate("/")}>
          Back To Home
        </Button>

        <h2 className="cart-heading">Shopping Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-left">
            {cartItems.map((item) => (
              <div className="cart-row" key={item.productId}> 
                
                <img src={item.image} alt={item.name} />

                <div className="cart-row-info">
                  <h5>{item.name}</h5>
                  <p>₹{item.price}</p>

                  <div className="qty-box">
                    <button onClick={() => decQty(item.productId)}> - </button> 
                    <span>{item.qty}</span>
                    <button onClick={() => incQty(item.productId)}> + </button> 
                  </div>
                </div>

                <div className="cart-row-total">
                  ₹{item.price * item.qty}
                  <span
                    className="remove-text"
                    onClick={() => removeFromCart(item.productId)} 
                  >
                    Remove
                  </span>
                </div>

              </div>
            ))}
          </div>

          <div className="cart-right">
            <h4>Price Details</h4>

            <div className="summary-line">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="summary-line total">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            <Link to="/checkout">
              <Button variant="success">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;