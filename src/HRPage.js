import React, { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";
import "./hr.css";

function HRPage({ user }) {

  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]); // 🔥 NEW

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAll, setShowAll] = useState(false);
  

  // 🔥 LOAD EMPLOYEES
  const loadData = useCallback(() => {
    if (!user || !user.company) return;

    fetch(`http://localhost:8080/company/users/${user.company.id}`)
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, [user]);

  // 🔥 LOAD EXPERIENCE REQUESTS
  const loadRequests = () => {
    fetch("http://localhost:8080/experience/pending")
      .then(res => res.json())
      .then(data => setRequests(data));
  };

  // 🔥 LOAD PENDING EMPLOYEES
  const loadPendingUsers = () => {
    fetch("http://localhost:8080/company/pending")
      .then(res => res.json())
      .then(data => setPendingUsers(data));
  };

  useEffect(() => {
    loadRequests();
    loadPendingUsers(); // 🔥 IMPORTANT
  }, [loadData]);

  // 🔥 ADD / UPDATE
  const saveEmployee = () => {
    const url = editId
      ? `http://localhost:8080/company/update/${editId}`
      : `http://localhost:8080/company/user/${user.company.id}`;

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password: "1234",
        role: "EMPLOYEE"
      })
    }).then(() => {
      setEditId(null);
      setName("");
      setEmail("");
      setPhone("");
      loadData();
      setShowAll(true);
    });
  };

  const deleteEmployee = (id) => {
    fetch(`http://localhost:8080/company/delete/${id}`, {
      method: "DELETE"
    }).then(loadData);
  };

  const approveEmployee = (id) => {
    fetch(`http://localhost:8080/company/approve/${id}`, {
      method: "PUT"
    }).then(() => {
      loadData();
      loadPendingUsers(); // 🔥 refresh
    });
  };

  const editEmployee = (emp) => {
    setEditId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone || "");
  };

  const approveHR = (id) => {
    fetch(`http://localhost:8080/experience/hr-approve/${id}`, {
      method: "PUT"
    }).then(loadRequests);
  };

  // 🔥 SEARCH FILTER
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.phone && e.phone.includes(search))
  );

  const displayData = showAll || search ? filtered : [];

  // 🔥 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployees = displayData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  return (
    <Layout user={user}>
      <div className="hr-container">

        <h2 className="title">HR Dashboard</h2>

        {/* 🔔 NEW EMPLOYEE REQUESTS */}
        <div className="card">
          <h3>🔔 New Employee Requests ({pendingUsers.length})</h3>

          {pendingUsers.length === 0 ? (
            <p>No new requests</p>
          ) : (
            pendingUsers.map(emp => (
              <div key={emp.id} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #eee"
              }}>
                <div>
                  <b>{emp.name}</b> ({emp.email})
                </div>

                <button
                  className="btn success"
                  onClick={() => {
                    approveEmployee(emp.id);
                    setPendingUsers(prev =>
                      prev.filter(e => e.id !== emp.id)
                    );
                  }}
                >
                  Approve
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🔍 SEARCH */}
        <input
          className="search"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setShowAll(false);
            loadData();
          }}
        />

        {/* 🔥 SHOW / HIDE BUTTON */}
        <div style={{ marginBottom: "10px" }}>
          <button
            className="btn primary"
            onClick={() => {
              if (showAll) {
                setShowAll(false);
                setSearch("");
              } else {
                loadData();
                setShowAll(true);
              }
            }}
          >
            {showAll ? "Hide" : "Show All"}
          </button>
        </div>

        {/* FORM */}
        <div className="form">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <button className="btn primary" onClick={saveEmployee}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* 👥 EMPLOYEES */}
        <div className="card">
          <h3>👥 Employees</h3>

          {displayData.length === 0 ? (
            <p style={{ padding: "10px" }}>Search employee to see data</p>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>CV</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone || "-"}</td>
                      <td>{emp.role}</td>

                      <td>
                        <span className={`badge ${emp.status === "APPROVED" ? "green" : "yellow"}`}>
                          {emp.status}
                        </span>
                      </td>

                      <td>
                        {emp.cvFile ? (
                          <a href={`http://localhost:8080/company/cv/${emp.cvFile}`} target="_blank" rel="noreferrer">
                            View
                          </a>
                        ) : "No CV"}
                      </td>

                      <td>
                        <button className="btn" onClick={() => editEmployee(emp)}>Edit</button>
                        <button className="btn danger" onClick={() => deleteEmployee(emp.id)}>Delete</button>

                        {emp.status === "PENDING" && (
                          <button className="btn success" onClick={() => approveEmployee(emp.id)}>
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>

                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}

                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
              </div>
            </>
          )}
        </div>

        {/* 📩 EXPERIENCE */}
        <div className="card">
          <h3>📩 Experience Requests</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Company</th>
                <th>Role</th>
                <th>Years</th>
                <th>Skills</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.user?.name}</td>
                  <td>{r.companyName}</td>
                  <td>{r.role}</td>
                  <td>{r.years}</td>
                  <td>{r.skills}</td>

                  <td>
                    <button className="btn success" onClick={() => approveHR(r.id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </Layout>
  );
}

export default HRPage;