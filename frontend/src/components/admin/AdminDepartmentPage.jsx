import React from "react";
import Layout from "../common/Layout";
import DepartmentSection from "../DepartmentSection";

const AdminDepartmentPage = () => {
  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "#00ffff" }}>Manage Departments</h2>
        <DepartmentSection />
      </div>
    </Layout>
  );
};

export default AdminDepartmentPage;
