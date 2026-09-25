import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

const getFutureDate = (days = 2) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: getFutureDate(2),
    status: "Pending",
  });

  const reloadData = async () => {
    try {
      const taskRes = await api.get("/tasks");
      setTasks(taskRes.data);

      try {
        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
      } catch {
        // Ignore non-admin
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const taskRes = await api.get("/tasks");
        if (isMounted) setTasks(taskRes.data);

        try {
          const usersRes = await api.get("/users");
          if (isMounted) setUsers(usersRes.data);
        } catch {
          // Ignore
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "Medium",
      dueDate: getFutureDate(2),
      status: "Pending",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || task.assignedTo || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : getFutureDate(0),
      status: task.status || "Pending",
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
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
      } else {
        await api.post("/tasks", form);
      }
      setShowModal(false);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      return;
    }
    try {
      await api.delete(`/tasks/${task._id}`);
      reloadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task._id}/status`, { status: newStatus });
      reloadData();
    } catch {
      alert("Failed to update task status");
    }
  };

  const columns = [
    { key: "title", label: "Task Title" },
    { key: "description", label: "Description" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
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
          <h1>Task & Activity Manager</h1>
          <p>Assign tasks, set priorities, and keep track of deadlines.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={(task) => (
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task, e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              borderColor: "#cbd5e1",
              marginRight: "4px",
            }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        )}
      />

      <Modal
        isOpen={showModal}
        title={editingTask ? "Edit Task" : "Add Task"}
        onClose={() => setShowModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label>Task Title *</label>
            <input
              name="title"
              placeholder="e.g. Schedule Q3 Sales Review"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign To Employee *</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Task Description</label>
            <textarea
              name="description"
              placeholder="Detailed instructions for the assigned task..."
              value={form.description}
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
              {editingTask ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;