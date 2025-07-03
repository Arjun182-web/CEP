import React, { useState } from "react";

const EditDepartmentForm = ({ department, onClose, onUpdated }) => {
  const [hod, setHod] = useState(department.hod || { name: "", email: "", position: "" });
  const [faculties, setFaculties] = useState(department.faculties || []);

  const handleFacultyChange = (index, field, value) => {
    const updated = [...faculties];
    updated[index][field] = value;
    setFaculties(updated);
  };

  const addFaculty = () => {
    setFaculties([...faculties, { name: "", email: "", position: "" }]);
  };

  const removeFaculty = (index) => {
    setFaculties(faculties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://cep-backend.onrender.com/admin/departments/${department._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          hod,
          faculties,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("✅ Department updated successfully");
      onUpdated && onUpdated();
      onClose && onClose();
    } catch (error) {
      console.error("❌ Update failed:", error);
      alert("❌ Failed to update department");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#222",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        color: "#fff",
      }}
    >
      <h3 style={{ color: "#0ff" }}>Edit Department: {department.name}</h3>

      <h4>HOD</h4>
      <input
        placeholder="Name"
        value={hod.name}
        onChange={(e) => setHod({ ...hod, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={hod.email}
        onChange={(e) => setHod({ ...hod, email: e.target.value })}
      />
      <input
        placeholder="Position"
        value={hod.position}
        onChange={(e) => setHod({ ...hod, position: e.target.value })}
      />

      <h4>Faculties</h4>
      {faculties.map((f, i) => (
        <div key={i}>
          <input
            placeholder="Name"
            value={f.name}
            onChange={(e) => handleFacultyChange(i, "name", e.target.value)}
          />
          <input
            placeholder="Email"
            value={f.email}
            onChange={(e) => handleFacultyChange(i, "email", e.target.value)}
          />
          <input
            placeholder="Position"
            value={f.position}
            onChange={(e) => handleFacultyChange(i, "position", e.target.value)}
          />
          <button type="button" onClick={() => removeFaculty(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addFaculty}>
        Add Faculty
      </button>

      <div style={{ marginTop: "20px" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditDepartmentForm;
