import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  LayoutDashboard,
  UserCheck,
  Target,
  CheckSquare,
  DollarSign,
  Users,
  ShieldCheck,
  Settings,
  Building2,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Building2 size={20} />
        </div>
        <span className="sidebar-logo-text">Apex CRM</span>
      </div>

      <nav>
        <NavLink to="/dashboard">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/customers">
          <UserCheck size={18} />
          <span>Customers</span>
        </NavLink>

        <NavLink to="/leads">
          <Target size={18} />
          <span>Leads</span>
        </NavLink>

        <NavLink to="/tasks">
          <CheckSquare size={18} />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/sales">
          <DollarSign size={18} />
          <span>Sales</span>
        </NavLink>

        {user?.role !== "employee" && (
          <NavLink to="/employees">
            <Users size={18} />
            <span>Employees</span>
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/users">
            <ShieldCheck size={18} />
            <span>User Accounts</span>
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/settings">
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <span>CRM Workspace v1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;