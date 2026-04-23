import React, { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";

function AdminPage({ user }) {

  const [hrs, setHrs] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ FIX: useCallback added
  const loadHR = useCallback(() => {
    if (!user || !user.company) return;

    fetch(`http://localhost:8080/company/users/${user.company.id}`)
      .then(res => res.json())
      .then(data => setHrs(data.filter(u => u.role === "HR")));
  }, [user]);

  useEffect(() => {
    loadHR();
  }, [loadHR]);

  const addHR = () => {
    fetch(`http://localhost:8080/company/user/${user.company.id}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name,
        email,
        password: "1234",
        role: "HR"
      })
    }).then(() => {
      setName("");
      setEmail("");
      loadHR();
    });
  };

  return (
    <Layout user={user}>
      <h2>Admin - Manage HR</h2>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input
  type="password"
  placeholder="Enter Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
      <button onClick={addHR}>Add HR</button>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {hrs.map(hr => (
            <tr key={hr.id}>
              <td>{hr.name}</td>
              <td>{hr.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </Layout>
  );
}

export default AdminPage;