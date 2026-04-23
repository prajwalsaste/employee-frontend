import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ USED
  const navigate = useNavigate();

  const register = () => {
    fetch("http://localhost:8080/company/user/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password, // ✅ USED HERE
        role: "EMPLOYEE"
      })
    }).then(() => {
      alert("Request sent to HR for approval");
      navigate("/");
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Employee Registration</h2>

        <input
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔥 PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>
          Register
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have account?
        </p>

        <button onClick={() => navigate("/")}>
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default Register;