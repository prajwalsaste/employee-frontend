import Layout from "./Layout";

function EmployeePage({ user }) {
  return (
    <Layout user={user}>
      <h2>Employee Dashboard</h2>
      <p>View your profile</p>
    </Layout>
  );
}

export default EmployeePage;