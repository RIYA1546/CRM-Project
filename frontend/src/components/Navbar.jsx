import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="navbar">
      <div className="navbar-title">
        <span>Customer Relationship Management System</span>
      </div>

      <div className="navbar-user">
        <div className="user-profile-badge">
          <div className="avatar-circle">{initial}</div>
          <div className="user-info-text">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="role-pill">{user?.role || "employee"}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;