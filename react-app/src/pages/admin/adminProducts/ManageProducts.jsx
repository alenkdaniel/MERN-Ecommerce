import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState({
    _id: null,
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: "",
    rating: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products?admin=true", // 🔥 FIX
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setForm({
      _id: null,
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
      stock: "",
      rating: "",
    });
  };


  const handleAddProduct = async () => {
    try {
      if (!form.name || !form.price || !form.category) {
        return alert("Name, Price and Category are required");
      }

      const duplicate = products.find(
        (p) => p.name.toLowerCase() === form.name.toLowerCase(),
      );

      if (duplicate) {
        alert("Product already exists");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: form.name,
          price: Number(form.price),
          category: form.category,
          image: form.image,
          description: form.description,
          stock: Number(form.stock),
          rating: Number(form.rating),
        },
        authHeader,
      );

      toast.success("Product added successfully");
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Error adding product");
    }
  };


  const editProduct = (product) => {
    setIsEditing(true);
    setForm({ ...product });
  };


  const handleUpdateProduct = async () => {
    try {
      const updateData = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        image: form.image,
        description: form.description,
        stock: Number(form.stock),
      };

      await axios.put(
        `http://localhost:5000/api/products/${form._id}`,
        updateData,
        authHeader,
      );

      toast.success("Product updated successfully");
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Error updating product");
    }
  };


 const deactivateProduct = async (id) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/products/${id}`,
      { isActive: false },
      authHeader
    );

    console.log("DEACTIVATE:", res.data);
    fetchProducts();
  } catch (error) {
    console.log("ERROR:", error.response);
  }
};

const reactivateProduct = async (id) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/products/${id}`,
      { isActive: true },
      authHeader
    );

    console.log("REACTIVATE:", res.data);
    fetchProducts();
  } catch (error) {
    console.log("ERROR:", error.response);
  }
};


  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All"
        ? true
        : p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-products-container">
      <h2>Product Management</h2>

      {/* FORM */}
      <div className="product-form">
        <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />
        <input
          name="rating"
          type="number"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
        />

        {!isEditing ? (
          <button onClick={handleAddProduct}>Add Product</button>
        ) : (
          <>
            <button onClick={handleUpdateProduct}>Update</button>
            <button onClick={resetForm}>Cancel</button>
          </>
        )}
      </div>


      <div className="admin-filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>


      <div className="products-list">
        {filteredProducts.map((p) => {
          const isActive = p.isActive !== false;

          return (
            <div key={p._id} className="admin-product-card">
              <img src={p.image} alt={p.name} />

              <div>
                <h4>{p.name}</h4>
                <p>₹ {p.price}</p>
                <p>{p.category}</p>
                <p>Stock: {p.stock}</p>

                <span className={isActive ? "active" : "inactive"}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="product-actions">
                <button className="edit-btn" onClick={() => editProduct(p)}>
                   Edit
                </button>

                {isActive ? (
                  <button
                    className="danger"
                    onClick={() => deactivateProduct(p._id)}
                  >
                     Deactivate
                  </button>
                ) : (
                  <button
                    className="success"
                    onClick={() => reactivateProduct(p._id)}
                  >
                     Activate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageProducts;
