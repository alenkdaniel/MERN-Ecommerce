import React, { useContext } from "react";
import "./AdminDashboard.css";
import { Link, useLocation } from "react-router-dom";
import { OrdersContext } from "../../context/ordersContext";

import { Bar, Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {

  const { orders } = useContext(OrdersContext);
  const location = useLocation();

  const safeOrders = orders || []; 
  const active = (path) =>
    location.pathname === path ? "active" : "";


  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const ordersPerDay = new Array(7).fill(0);

  safeOrders.forEach(order=>{
    const day = new Date(order.createdAt).getDay();
    ordersPerDay[day]++;
  });

  const ordersChart = {
    labels: days,
    datasets:[
      {
        label:"Orders",
        data: ordersPerDay,
        backgroundColor:"#5c7cff",
        borderRadius:8
      }
    ]
  };



  const revenuePerDay = new Array(7).fill(0);

  safeOrders.forEach(order=>{
    const day = new Date(order.createdAt).getDay();
    revenuePerDay[day] += order.totalAmount;
  });

  const revenueChart = {
    labels: days,
    datasets:[
      {
        label:"Revenue",
        data: revenuePerDay,
        borderColor:"#22c55e",
        backgroundColor:"rgba(34,197,94,0.2)",
        tension:0.4
      }
    ]
  };



  const productSales = {};

  safeOrders.forEach(order=>{
    (order.products || []).forEach(item=>{
      if(!productSales[item.name]){
        productSales[item.name] = 0;
      }
      productSales[item.name] += item.quantity;
    });
  });

  const productChart = {
    labels:Object.keys(productSales),
    datasets:[
      {
        data:Object.values(productSales),
        backgroundColor:[
          "#5c7cff",
          "#22c55e",
          "#f59e0b",
          "#7c3aed",
          "#00ffd0"
        ]
      }
    ]
  };



  const totalOrders = safeOrders.length;

  const revenue = safeOrders.reduce(
    (sum,o)=> sum + o.totalAmount, 0
  );

  const pending = safeOrders.filter(
    o => o.status === "Pending"
  ).length;

  return (
    <div className="dash-layout">


      <aside className="sidebar">
        <h2 className="logo">Admin</h2>

        <nav>
          <Link className={active("/admin/dashboard")} to="/admin/dashboard">
            Dashboard
          </Link>

          <Link className={active("/admin/products")} to="/admin/products">
            Products
          </Link>

          <Link className={active("/admin/users")} to="/admin/users">
            Users
          </Link>

          <Link className={active("/admin/orders")} to="/admin/orders">
            Orders
          </Link>
        </nav>
      </aside>

  
      <main className="dash-main">

        <div className="stats-grid">

          <div className="stat blue">
            <h4>Total Orders</h4>
            <h2>{totalOrders}</h2>
          </div>

          <div className="stat green">
            <h4>Total Revenue</h4>
            <h2>₹{revenue}</h2>
          </div>

          <div className="stat red">
            <h4>Pending Orders</h4>
            <h2>{pending}</h2>
          </div>

        </div>

   
        <div className="charts-grid">

          <div className="panel">
            <h3>Orders Overview</h3>
            <Bar data={ordersChart}/>
          </div>

          <div className="panel">
            <h3>Revenue Growth</h3>
            <Line data={revenueChart}/>
          </div>

          <div className="panel">
            <h3>Top Selling Products</h3>
            <Pie data={productChart}/>
          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;