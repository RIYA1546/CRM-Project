import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const initialFormState = {
    customer: "",
    employee: "",
    product: "",
    amount: 0,
    paymentStatus: "Pending",
    saleDate: new Date().toISOString().split("T")[0],
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);

  const reloadData = async () => {
    try {
      const salesRes = await api.get("/sales");
      setSales(salesRes.data);

      try {
        const custRes = await api.get("/customers");
        setCustomers(custRes.data);
      } catch (e) {
        console.error("Customers load error:", e);
      }

      try {
        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
      } catch (e) {
        console.error("Users load error:", e);
      }
    } catch (error) {
      console.error("Failed to load sales", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const salesRes = await api.get("/sales");
        if (isMounted) setSales(salesRes.data);

        try {
          const custRes = await api.get("/customers");
          if (isMounted) setCustomers(custRes.data);
        } catch (e) {
          console.error("Customers load error:", e);
        }

        try {
          const usersRes = await api.get("/users");
          if (isMounted) setUsers(usersRes.data);
        } catch (e) {
          console.error("Users load error:", e);
        }
      } catch (error) {
        console.error("Failed to load sales", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingSale(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (sale) => {
    setEditingSale(sale);
    setForm({
      customer: sale.customer?._id || sale.customer || "",
      employee: sale.employee?._id || sale.employee || "",
      product: sale.product || "",
      amount: sale.amount || 0,
      paymentStatus: sale.paymentStatus || "Pending",
      saleDate: sale.saleDate
        ? new Date(sale.saleDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      notes: sale.notes || "",
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
      if (editingSale) {
        await api.put(`/sales/${editingSale._id}`, form);
      } else {
        await api.post("/sales", form);
      }
      setShowModal(false);
      setForm(initialFormState);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save sale record");
    }
  };

  const handleDelete = async (sale) => {
    if (!window.confirm(`Are you sure you want to delete sale for product "${sale.product}"?`)) {
      return;
    }
    try {
      await api.delete(`/sales/${sale._id}`);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete sale record");
    }
  };

  const columns = [
    {
      key: "customer",
      label: "Customer",
      render: (item) => item.customer?.name || "Unassigned Customer",
    },
    { key: "product", label: "Product / Service" },
    { key: "amount", label: "Amount" },
    { key: "paymentStatus", label: "Payment Status" },
    {
      key: "employee",
      label: "Sales Rep",
      render: (item) => item.employee?.name || "Unassigned",
    },
    { key: "saleDate", label: "Sale Date" },
  ];

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Sales Transactions</h1>
          <p>Record deals closed, invoices issued, and revenue tracking.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Sale
        </button>
      </div>

      <DataTable
        columns={columns}
        data={sales}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingSale ? "Edit Sale Record" : "Add New Sale"}
        onClose={() => setShowModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Customer *</label>
            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
            >
              <option value="">Choose Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.company || "No Company"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product / Service Name *</label>
            <input
              name="product"
              placeholder="e.g. Enterprise Cloud License"
              value={form.product}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sale Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              placeholder="50000"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Status</label>
            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sales Representative</label>
            <select
              name="employee"
              value={form.employee}
              onChange={handleChange}
            >
              <option value="">Choose Rep</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sale Date</label>
            <input
              type="date"
              name="saleDate"
              value={form.saleDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Notes & Invoice Reference</label>
            <textarea
              name="notes"
              placeholder="e.g. Invoice #INV-2026-088"
              value={form.notes}
              rows={2}
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
              {editingSale ? "Update Sale" : "Save Sale"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;