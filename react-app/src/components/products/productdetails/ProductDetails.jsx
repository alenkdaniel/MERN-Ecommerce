import React, { useContext, useEffect, useState } from "react";
import "./ProductDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { CartContext } from "../../../context/cartContext";
import { AuthContext } from "../../../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="pd-loading">Loading...</p>;
  if (!product) return <p className="pd-loading">No product found</p>;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="pd-wrapper">
      <div className="pd-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="pd-details-box">
        <h1>{product.name}</h1>

        <p className="pd-description">{product.description}</p>

        <div className="pd-price">₹ {product.price}</div>

        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Rating:</strong> ⭐ {product.rating}</p>

        <p style={{ color: product.stock > 0 ? "green" : "red" }}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <div className="pd-actions">
          <Button variant="success" onClick={handleAddToCart}>
            Add to Cart
          </Button>

          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
