import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  
  const fetchProducts = async () => {
    try {
      let params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category!=="All") params.append("category", category);
      if (sort) params.append("sort", sort);
      setLoading(true)
      const res = await axios.get(
        `http://localhost:5000/api/products?${params.toString()}`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error is ", error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="product-page">
      <h1 className="heading">Our Products</h1>

      <div className="product-layout">
        <aside className="filters-sidebar">
          <h3 className="filter-title">Filter Products</h3>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="mobile">Mobile</option>
              <option value="laptop">Laptop</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          <button
            className="reset-btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
            }}
          >
            Reset Filters
          </button>
        </aside>

        <section className="product-list">
          {loading ? (
            <p>Loading...</p>
          ) :products.length === 0 ? (
            <p>No products found</p>
          ) : (
           
            products.map((item) => (
              <div className="simple-product-card" key={item._id}>
                <div className="image-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="simple-product-body">
                  <h4 className="product-name">{item.name}</h4>

                  <Link
                    to={`/product/${item._id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
