import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    status: "active",
    notes: "",
    assignedTo: "",
  };

  const [form, setForm] = useState(initialFormState);

  const reloadData = async () => {
    try {
      const custRes = await api.get("/customers");
      setCustomers(custRes.data);

      try {
        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
      } catch {
        // Non-admins ignore
      }
    } catch (error) {
      console.error("Failed to load customers", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const custRes = await api.get("/customers");
        if (isMounted) setCustomers(custRes.data);

        try {
          const usersRes = await api.get("/users");
          if (isMounted) setUsers(usersRes.data);
        } catch {
          // Ignore
        }
      } catch (error) {
        console.error("Failed to load customers", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      status: customer.status || "active",
      notes: customer.notes || "",
      assignedTo: customer.assignedTo?._id || customer.assignedTo || "",
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
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer._id}`, form);
      } else {
        await api.post("/customers", form);
      }
      setShowModal(false);
      setForm(initialFormState);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save customer");
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
      return;
    }
    try {
      await api.delete(`/customers/${customer._id}`);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete customer");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (item) => item.assignedTo?.name || "Unassigned",
    },
  ];

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Customers</h1>
          <p>Manage client accounts, contact details, and account owners.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        onClose={() => setShowModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              name="name"
              placeholder="e.g. Acme Corporation"
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
              placeholder="contact@acme.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              name="phone"
              placeholder="+1 (555) 0199"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              name="company"
              placeholder="Acme Corp"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              placeholder="San Francisco"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              name="state"
              placeholder="CA"
              value={form.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign To Employee</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">Select Employee</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <input
              name="address"
              placeholder="100 Innovation Way"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Key notes regarding this customer..."
              value={form.notes}
              rows={3}
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
              {editingCustomer ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;