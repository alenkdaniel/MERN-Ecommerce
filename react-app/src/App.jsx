import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./components/products/Products.jsx";
import ProductDetails from "./components/products/productdetails/ProductDetails.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Orders from "./pages/orders/Orders.jsx";
import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageProducts from "./pages/admin/adminProducts/ManageProducts.jsx";
import ManageUsers from "./pages/admin/adminUsers/ManageUsers.jsx";
import ManageOrders from "./pages/admin/adminOrders/ManageOrders.jsx";
import About from "./pages/about/About.jsx";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <Navbar />

      <ScrollToTop />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Navigate to="/admin/dashboard" replace />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute>
                <ManageProducts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <ManageOrders />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <Footer />
    </>
  );
};

export default App;
