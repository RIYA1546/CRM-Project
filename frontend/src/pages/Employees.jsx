import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "employee",
    status: "active",
    joiningDate: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(initialFormState);

  const reloadEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employees", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        if (isMounted) setEmployees(response.data);
      } catch (error) {
        console.error("Failed to load employees", error);
      }
    };

    fetchEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      designation: emp.designation || "",
      role: emp.role || "employee",
      status: emp.status || "active",
      joiningDate: emp.joiningDate
        ? new Date(emp.joiningDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
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
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, form);
      } else {
        await api.post("/employees", form);
      }
      setShowModal(false);
      setForm(initialFormState);
      reloadEmployees();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save employee");
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Are you sure you want to delete employee "${emp.name}"?`)) {
      return;
    }
    try {
      await api.delete(`/employees/${emp._id}`);
      reloadEmployees();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Employee Directory</h1>
          <p>Manage staff, designations, departments, and roles.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
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
            <label>Department</label>
            <input
              name="department"
              placeholder="e.g. Sales, Support"
              value={form.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              name="designation"
              placeholder="e.g. Account Executive"
              value={form.designation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>System Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Employment Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
            />
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
              {editingEmployee ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;