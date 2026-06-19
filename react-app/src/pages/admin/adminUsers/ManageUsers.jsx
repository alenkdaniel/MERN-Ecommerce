import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import closeIcon from "../../../images/close.png";
import "./ManageUsers.css";
import { AuthContext } from "../../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { token } = useContext(AuthContext);

  
  const fetchUsers = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/users?page=${page}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages); 
    } catch (error) {
      console.error(error.response);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [token, page]);

 
  useEffect(() => {
    if (!token) return;

    const delay = setTimeout(() => {
      setPage(1); 
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  
  const toggleBlockUser = async (user) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${user._id}/block`,
        { isBlocked: !user.isBlocked },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error.response);
    }
  };


  const deactivateUser = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/deactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error.response);
    }
  };


  const activateUser = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/activate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div className="admin-users-container">
      <h2>User Management</h2>

   
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

 
      <div className="users-grid">
        {users.length === 0 ? (
          <p className="no-users">No users found</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <h4>{user.name || "Admin"}</h4>

                <span
                  className={
                    user.isActive === false
                      ? "status inactive"
                      : user.isBlocked
                      ? "status blocked"
                      : "status active"
                  }
                >
                  {user.isActive === false
                    ? "Inactive"
                    : user.isBlocked
                    ? "Blocked"
                    : "Active"}
                </span>
              </div>

              <p className="email">{user.email}</p>
              <p className="role">Role: {user.role}</p>

              <div className="user-actions">
                <button
                  className="view"
                  onClick={() => setSelectedUser(user)}
                >
                  View
                </button>

                {user.role !== "admin" && (
                  <>
                    <button
                      className={user.isBlocked ? "success" : "danger"}
                      onClick={() => toggleBlockUser(user)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {user.isActive !== false ? (
                      <button
                        className="danger-outline"
                        onClick={() => deactivateUser(user._id)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="success-outline"
                        onClick={() => activateUser(user._id)}
                      >
                        Activate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

     
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

 
      {selectedUser && (
        <div className="user-overlay">
          <div className="user-panel">
            <div className="panel-header">
              <h3>User Details</h3>
              <button onClick={() => setSelectedUser(null)}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>

            <div className="panel-body">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>ID:</strong> {selectedUser._id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;