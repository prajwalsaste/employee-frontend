import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./employee.css";

function EmployeePage({ user }) {

  const [showForm, setShowForm] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [skills, setSkills] = useState("");
  const [phone, setPhone] = useState("");

  const [file, setFile] = useState(null);

  const [experiences, setExperiences] = useState([]);

  // 🔥 LOAD EXPERIENCES
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/experience/user/${user.id}`)
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(err => console.log(err));
  }, [user]);

  // 🔥 PROFILE SCORE LOGIC
 // 🔥 PROFILE SCORE LOGIC (UPDATED)
let score = 0;

if (user?.name) score += 25;
if (user?.email) score += 25;
if (user?.cvFile) score += 25;
if (experiences.length > 0) score += 25;

  // 🔥 ADD EXPERIENCE
  const addExperience = () => {

    if (!user || !user.id) {
      alert("User not loaded");
      return;
    }

    fetch(`http://localhost:8080/experience/add/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        role,
        years,
        skills,
        phone
      })
    })
    .then(() => {
      alert("Sent to HR for approval");

      setShowForm(false);
      setCompanyName("");
      setRole("");
      setYears("");
      setSkills("");
      setPhone("");

      fetch(`http://localhost:8080/experience/user/${user.id}`)
        .then(res => res.json())
        .then(data => setExperiences(data));
    })
    .catch(() => alert("Error"));
  };

  // 🔥 UPLOAD CV
  const uploadCV = () => {

    if (!file) {
      alert("Select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:8080/company/upload-cv/${user.id}`, {
      method: "POST",
      body: formData
    })
    .then(() => alert("CV Uploaded"))
    .catch(() => alert("Upload Failed"));
  };

  return (
    <Layout user={user}>

      <div className="emp-container">

        <h2 className="title">Employee Dashboard</h2>

        {/* 🔥 PROFILE SCORE */}
        <div className="card">
          <h3>Profile Completion</h3>

          <div style={{
            background: "#eee",
            borderRadius: "10px",
            overflow: "hidden",
            height: "20px",
            marginBottom: "10px"
          }}>
            <div style={{
              width: `${score}%`,
              background: score === 100 ? "green" : "#4f6df5",
              height: "100%"
            }}></div>
          </div>

          <p><b>{score} / 100 Completed</b></p>

          {score === 100 && (
            <p style={{ color: "green" }}>Profile Complete 🎉</p>
          )}
        </div>

        {/* PROFILE */}
        <div className="card profile">
          <h3>Profile</h3>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
        </div>

        {/* CV */}
        <div className="card">
          <h3>Upload CV</h3>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn primary" onClick={uploadCV}>
            Upload CV
          </button>

          {user?.cvFile && (
            <p className="success">
              Uploaded:{" "}
              <a
                href={`http://localhost:8080/company/cv/${user.cvFile}`}
                target="_blank"
                rel="noreferrer"
              >
                View CV
              </a>
            </p>
          )}
        </div>

        {/* EXPERIENCE FORM */}
        <div className="card">
          <h3>Experience</h3>

          <button
            className="btn primary"
            onClick={() => setShowForm(true)}
          >
            Add Experience
          </button>

          {showForm && (
            <div className="form">

              <input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />

              <input
                placeholder="Years"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />

              <input
                placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="actions">
                <button className="btn success" onClick={addExperience}>
                  Submit
                </button>

                <button className="btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>

            </div>
          )}
        </div>

        {/* EXPERIENCE TABLE */}
        <div className="card">
          <h3>My Experiences</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Years</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {experiences.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.companyName}</td>
                  <td>{exp.role}</td>
                  <td>{exp.years}</td>
                  <td>
                    <span className={`badge ${
                      exp.status === "APPROVED"
                        ? "green"
                        : "yellow"
                    }`}>
                      {exp.status === "APPROVED" ? "Verified" : exp.status}
                    </span>
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

export default EmployeePage;