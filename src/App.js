import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import CompanyPage from "./CompanyPage";
import AdminPage from "./AdminPage";
import HRPage from "./HRPage";
import EmployeePage from "./EmployeePage";
import Register from "./Register";

function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <Routes>

      <Route path="/" element={<Login setUser={setUser} />} />

      <Route path="/companies" element={<CompanyPage user={user} />} />
      <Route path="/admin" element={<AdminPage user={user} />} />
      <Route path="/hr" element={<HRPage user={user} />} />
      <Route path="/employee" element={<EmployeePage user={user} />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App;