import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Layout({ user, children }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>EMS</h2>

        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>

          {user.role === "SUPER_ADMIN" && (
            <li onClick={() => navigate("/companies")}>Companies</li>
          )}

          {user.role === "ADMIN" && (
            <li onClick={() => navigate("/admin")}>Admin</li>
          )}

          {user.role === "HR" && (
            <li onClick={() => navigate("/hr")}>HR</li>
          )}

          {user.role === "EMPLOYEE" && (
            <li onClick={() => navigate("/employee")}>Profile</li>
          )}
        </ul>
      </div>

      {/* Main */}
      <div className="main">

        <div className="topbar">
          <h3>Welcome {user.name}</h3>
          <div>
            <span>{user.role}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="content">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;