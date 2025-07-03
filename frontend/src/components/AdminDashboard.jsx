import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://cep-backend.onrender.com/admin/users", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 403) {
          const msg = await res.text();
          setError(msg);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://cep-backend.onrender.com/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        alert("Error: " + msg);
        return;
      }

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - {user.email}
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
