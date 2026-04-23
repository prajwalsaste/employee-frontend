import React, { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";

function CompanyPage({ user }) {

  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🔥 LOAD COMPANIES
  const loadCompanies = useCallback(() => {
    fetch("http://localhost:8080/superadmins/companies")
      .then(res => res.json())
      .then(data => {
        console.log("Companies:", data); // ✅ DEBUG
        setCompanies(data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // 🔥 ADD COMPANY
  const addCompany = () => {
    fetch("http://localhost:8080/superadmins/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    })
      .then(() => {
        setName("");
        setEmail("");
        loadCompanies();
      });
  };

  // 🔥 APPROVE COMPANY
  const approveCompany = (id) => {
    fetch(`http://localhost:8080/superadmins/approve/${id}`, {
      method: "PUT"
    }).then(() => loadCompanies());
  };

  // 🔥 DELETE COMPANY
  const deleteCompany = (id) => {
    fetch(`http://localhost:8080/superadmins/delete/${id}`, {
      method: "DELETE"
    }).then(() => loadCompanies());
  };

  return (
    <Layout user={user}>
      <h2>Super Admin - Companies</h2>

      {/* ADD FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={addCompany}>Add Company</button>
      </div>

      {/* TABLE */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {companies && companies.length > 0 ? (
            companies.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>
                  {c.status === "PENDING" && (
                    <button onClick={() => approveCompany(c.id)}>
                      Approve
                    </button>
                  )}

                  <button onClick={() => deleteCompany(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </Layout>
  );
}

export default CompanyPage;