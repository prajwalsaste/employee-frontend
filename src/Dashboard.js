import React from "react";
import "./styles.css";
import { FaUsers, FaUserTie, FaBuilding } from "react-icons/fa";

function Dashboard({ user }) {
  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>EMS</h2>

        <ul>
          <li>🏠 Dashboard</li>

          {user.role === "SUPER_ADMIN" && <li><FaBuilding /> Companies</li>}
          {user.role === "ADMIN" && <li><FaUserTie /> HR Management</li>}
          {user.role === "HR" && <li><FaUsers /> Employee Management</li>}
          {user.role === "EMPLOYEE" && <li>👤 My Profile</li>}
        </ul>
      </div>

      {/* Main */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <h3>Welcome {user.name}</h3>
          <p>{user.role}</p>
        </div>

        {/* Cards */}
        <div className="card-container">

          {user.role === "SUPER_ADMIN" && (
            <div className="card">
              <FaBuilding size={30} />
              <h3>Manage Companies</h3>
            </div>
          )}

          {user.role === "ADMIN" && (
            <div className="card">
              <FaUserTie size={30} />
              <h3>Manage HR</h3>
            </div>
          )}

          {user.role === "HR" && (
            <div className="card">
              <FaUsers size={30} />
              <h3>Manage Employees</h3>
            </div>
          )}

          {user.role === "EMPLOYEE" && (
            <div className="card">
              👤
              <h3>My Profile</h3>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default Dashboard;