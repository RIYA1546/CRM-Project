const DashboardCard = ({ title, value, icon, colorClass = "blue" }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-top">
        <h3>{title}</h3>
        {icon && <div className={`dashboard-card-icon ${colorClass}`}>{icon}</div>}
      </div>
      <h1>{value}</h1>
    </div>
  );
};

export default DashboardCard;