import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";
import {
  UserCheck,
  Target,
  Users,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    totalEmployees: 0,
    totalTasks: 0,
    totalSales: 0,
  });

  const [salesStats, setSalesStats] = useState([]);
  const [leadStats, setLeadStats] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const statsRes = await api.get("/dashboard/stats");
        if (isMounted) setStats(statsRes.data);

        try {
          const salesRes = await api.get("/dashboard/sales-statistics");
          if (isMounted) setSalesStats(salesRes.data);
        } catch (err) {
          console.error("Sales stats load error", err);
        }

        try {
          const leadRes = await api.get("/dashboard/lead-statistics");
          if (isMounted) setLeadStats(leadRes.data);
        } catch (err) {
          console.error("Lead stats load error", err);
        }

        try {
          const actRes = await api.get("/dashboard/recent-activities");
          if (isMounted) setActivities(actRes.data);
        } catch (err) {
          console.error("Activities load error", err);
        }
      } catch (error) {
        console.error("Dashboard load error", error);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  const formattedSalesStats = salesStats.map((item) => ({
    date: item._id,
    amount: item.total,
  }));

  const formattedLeadStats = leadStats.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome back! Here is an overview of your business performance today.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/leads" className="primary-btn">
            <Target size={16} />
            Manage Leads
          </Link>
          <Link to="/sales" className="secondary-btn">
            <DollarSign size={16} />
            View Sales
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<UserCheck size={22} />}
          colorClass="blue"
        />

        <DashboardCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={<Target size={22} />}
          colorClass="purple"
        />

        <DashboardCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={22} />}
          colorClass="emerald"
        />

        <DashboardCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<CheckSquare size={22} />}
          colorClass="amber"
        />

        <DashboardCard
          title="Total Revenue"
          value={`₹${Number(stats.totalSales || 0).toLocaleString("en-IN")}`}
          icon={<DollarSign size={22} />}
          colorClass="rose"
        />
      </div>

      {/* Visual Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2>Revenue Trend</h2>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ width: "100%", height: 300 }}>
            {formattedSalesStats.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={formattedSalesStats}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No sales timeline data recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h2>Lead Distribution</h2>
          <div style={{ width: "100%", height: 300 }}>
            {formattedLeadStats.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={formattedLeadStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {formattedLeadStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No lead statistics available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="chart-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color="#4f46e5" />
            Recent Team Activities
          </h2>
        </div>

        {activities.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activities.map((act) => (
              <div
                key={act._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>
                    {act.user?.name || "System User"}
                  </span>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                    {act.action}
                  </p>
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No recent activities recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;