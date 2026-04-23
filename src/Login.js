import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await fetch("http://localhost:8080/comlogin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.role) {
        alert("Invalid Credentials");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      if (data.role === "SUPER_ADMIN") navigate("/companies");
      else if (data.role === "ADMIN") navigate("/admin");
      else if (data.role === "HR") navigate("/hr");
      else navigate("/employee");

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to EMS System</p>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={login}>
          Login
        </button>

        <p className="register-text">New Employee?</p>

        <button
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

      </div>
    </div>
  );
}

export default Login;