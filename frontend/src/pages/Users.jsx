import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    role: "employee",
    status: "active",
    password: "",
  };

  const [form, setForm] = useState(initialFormState);

  const reloadUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        if (isMounted) setUsers(response.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "employee",
      status: user.status || "active",
      password: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, payload);
      } else {
        await api.post("/users", payload);
      }

      setShowModal(false);
      setForm(initialFormState);
      reloadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user account "${user.name}"?`)) {
      return;
    }
    try {
      await api.delete(`/users/${user._id}`);
      reloadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      reloadUsers();
    } catch {
      alert("Failed to update role");
    }
  };

  const columns = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>User Account Management</h1>
          <p>Manage CRM system access, login credentials, and admin roles.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={(u) => (
          <select
            value={u.role}
            onChange={(e) => handleRoleChange(u, e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              borderColor: "#cbd5e1",
              marginRight: "4px",
            }}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        )}
      />

      <Modal
        isOpen={showModal}
        title={editingUser ? "Edit User Account" : "Add User Account"}
        onClose={() => setShowModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="email@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="+1 555-0100"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Password {editingUser ? "(Leave blank to keep unchanged)" : "*"}
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required={!editingUser}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Account Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editingUser ? "Update User" : "Save User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;