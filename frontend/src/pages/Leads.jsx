import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "New",
    expectedValue: 0,
    assignedTo: "",
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);

  const reloadData = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);

      try {
        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
      } catch {
        // Non-admin ignore
      }
    } catch (error) {
      console.error("Failed to load leads", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await api.get("/leads");
        if (isMounted) setLeads(res.data);

        try {
          const usersRes = await api.get("/users");
          if (isMounted) setUsers(usersRes.data);
        } catch {
          // Ignore
        }
      } catch (error) {
        console.error("Failed to load leads", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingLead(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "Website",
      status: lead.status || "New",
      expectedValue: lead.expectedValue || 0,
      assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
      notes: lead.notes || "",
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
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, form);
      } else {
        await api.post("/leads", form);
      }
      setShowModal(false);
      setForm(initialFormState);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save lead");
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
      return;
    }
    try {
      await api.delete(`/leads/${lead._id}`);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete lead");
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    try {
      await api.put(`/leads/${lead._id}/status`, { status: newStatus });
      reloadData();
    } catch {
      alert("Failed to update status");
    }
  };

  const columns = [
    { key: "name", label: "Lead Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
    { key: "expectedValue", label: "Expected Value" },
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
          <h1>Leads & Opportunities</h1>
          <p>Track potential clients through your sales pipeline.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={(lead) => (
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(lead, e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              borderColor: "#cbd5e1",
              marginRight: "4px",
            }}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        )}
      />

      <Modal
        isOpen={showModal}
        title={editingLead ? "Edit Lead" : "Add Lead"}
        onClose={() => setShowModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lead Contact Name *</label>
            <input
              name="name"
              placeholder="e.g. Samantha Vance"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="svance@techflow.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="+1 (555) 0144"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              name="company"
              placeholder="TechFlow Systems"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Lead Source</label>
            <select name="source" value={form.source} onChange={handleChange}>
              <option value="Website">Website</option>
              <option value="Social Media">Social Media</option>
              <option value="Referral">Referral</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pipeline Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="form-group">
            <label>Expected Deal Value (₹)</label>
            <input
              type="number"
              name="expectedValue"
              placeholder="45000"
              value={form.expectedValue}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign To Rep</label>
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
            <label>Notes & Requirement Details</label>
            <textarea
              name="notes"
              placeholder="Specific details about lead requirements or history..."
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
              {editingLead ? "Update Lead" : "Save Lead"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;