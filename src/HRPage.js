import React, { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";

function HRPage({ user }) {

  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔥 Load Employees
  const loadData = useCallback(() => {
    if (!user || !user.company) return;

    fetch(`http://localhost:8080/company/users/${user.company.id}`)
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔥 Add / Update Employee
  const saveEmployee = () => {
    if (editId) {
      fetch(`http://localhost:8080/company/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      }).then(() => {
        setEditId(null);
        setName("");
        setEmail("");
        loadData();
      });
    } else {
      fetch(`http://localhost:8080/company/user/${user.company.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: "1234",
          role: "EMPLOYEE"
        })
      }).then(() => {
        setName("");
        setEmail("");
        loadData();
      });
    }
  };

  // 🔥 Delete Employee
  const deleteEmployee = (id) => {
    fetch(`http://localhost:8080/company/delete/${id}`, {
      method: "DELETE"
    }).then(loadData);
  };

  // 🔥 Approve Employee (NEW FEATURE)
  const approveEmployee = (id) => {
    fetch(`http://localhost:8080/company/approve/${id}`, {
      method: "PUT"
    }).then(loadData);
  };

  // 🔥 Edit Employee
  const editEmployee = (emp) => {
    setEditId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
  };

  // 🔥 Search Filter
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout user={user}>
      <h2>HR Dashboard</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search employee..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ➕ Add / Update */}
      <div style={{ margin: "10px 0" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={saveEmployee}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* 📋 Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.status}</td>
              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>
                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>

                {/* 🔥 APPROVE BUTTON */}
                {emp.status === "PENDING" && (
                  <button onClick={() => approveEmployee(emp.id)}>
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </Layout>
  );
}

export default HRPage;