import { useState } from "react";
import { Search, Edit, Trash2, FolderOpen } from "lucide-react";

const DataTable = ({ columns, data = [], onEdit, onDelete, actions }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Normalize column definitions
  const normalizedColumns = columns.map((col) => {
    if (typeof col === "string") {
      const formattedLabel = col
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return { key: col, label: formattedLabel };
    }
    return col;
  });

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some((val) => {
      if (!val) return false;
      if (typeof val === "object" && val.name) {
        return val.name.toLowerCase().includes(term);
      }
      return String(val).toLowerCase().includes(term);
    });
  });

  // Badge CSS helper
  const getBadgeClass = (val) => {
    if (!val) return "badge";
    const str = String(val).toLowerCase();
    if (["active", "won", "paid", "completed"].includes(str)) return "badge badge-active";
    if (["inactive", "lost", "cancelled"].includes(str)) return "badge badge-inactive";
    if (["pending", "partial", "proposal", "negotiation"].includes(str)) return "badge badge-pending";
    if (["in progress", "progress", "new", "contacted", "qualified"].includes(str)) return "badge badge-progress";
    if (str === "high") return "badge badge-high";
    if (str === "medium") return "badge badge-medium";
    if (str === "low") return "badge badge-low";
    return "badge";
  };

  const renderCellValue = (item, col) => {
    if (col.render) {
      return col.render(item);
    }

    const value = item[col.key];

    if (value === null || value === undefined) {
      return "-";
    }

    // Handle populated mongoose reference objects
    if (typeof value === "object" && !Array.isArray(value)) {
      if (value.name) return value.name;
      if (value.title) return value.title;
      return JSON.stringify(value);
    }

    // Status or Priority formatting
    if (["status", "paymentStatus", "priority"].includes(col.key)) {
      return <span className={getBadgeClass(value)}>{value}</span>;
    }

    // Date formatting
    if (col.key.toLowerCase().includes("date") || col.key === "createdAt") {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      } catch {
        // Fall back to raw
      }
    }

    // Currency formatting
    if (col.key === "amount" || col.key === "expectedValue") {
      return `₹${Number(value).toLocaleString("en-IN")}`;
    }

    return String(value);
  };

  const hasActions = onEdit || onDelete || actions;

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-count-badge">
          Showing {filteredData.length} of {data.length} entries
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {normalizedColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={item._id || idx}>
                  {normalizedColumns.map((col) => (
                    <td key={col.key}>{renderCellValue(item, col)}</td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="action-buttons-group">
                        {actions && actions(item)}
                        {onEdit && (
                          <button
                            className="icon-action-btn"
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="icon-action-btn danger"
                            onClick={() => onDelete(item)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={normalizedColumns.length + (hasActions ? 1 : 0)}>
                  <div className="empty-state">
                    <FolderOpen size={40} />
                    <h3>No Records Found</h3>
                    <p>
                      {searchTerm
                        ? "No entries match your search query."
                        : "There are no entries recorded yet."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;