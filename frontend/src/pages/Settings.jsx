import { useEffect, useState } from "react";
import api from "../services/api";
import { Check, Save } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    smtpHost: "",
    smtpPort: 587,
    smtpEmail: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get("/settings");
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save settings");
    }
  };

  if (loading) {
    return <div className="page">Loading settings...</div>;
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>System & Company Settings</h1>
          <p>Configure company profile information, currency defaults, and mail server credentials.</p>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            color: "#15803d",
            padding: "12px 18px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #86efac",
            fontWeight: 500,
          }}
        >
          <Check size={18} />
          System settings updated successfully!
        </div>
      )}

      <div className="settings-card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Company Info */}
          <div>
            <div className="settings-section-title">Company Profile</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  name="companyName"
                  placeholder="Apex CRM Solutions"
                  value={settings.companyName || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company Email</label>
                <input
                  type="email"
                  name="companyEmail"
                  placeholder="contact@apexcrm.com"
                  value={settings.companyEmail || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company Phone</label>
                <input
                  name="companyPhone"
                  placeholder="+1 (800) 555-8000"
                  value={settings.companyPhone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Office Address</label>
                <textarea
                  name="companyAddress"
                  placeholder="500 Innovation Tower, Suite 1200, San Francisco, CA"
                  value={settings.companyAddress || ""}
                  rows={2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Localization & Preferences */}
          <div>
            <div className="settings-section-title">Localization & Regional</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Default Currency Code</label>
                <select name="currency" value={settings.currency || "INR"} onChange={handleChange}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select name="timezone" value={settings.timezone || "Asia/Kolkata"} onChange={handleChange}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date Format</label>
                <select name="dateFormat" value={settings.dateFormat || "DD/MM/YYYY"} onChange={handleChange}>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* SMTP Mail Credentials */}
          <div>
            <div className="settings-section-title">Mail & SMTP Server Configuration</div>
            <div className="form-grid">
              <div className="form-group">
                <label>SMTP Host</label>
                <input
                  name="smtpHost"
                  placeholder="smtp.mailgun.org"
                  value={settings.smtpHost || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>SMTP Port</label>
                <input
                  type="number"
                  name="smtpPort"
                  placeholder="587"
                  value={settings.smtpPort || 587}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Sender Email Address</label>
                <input
                  type="email"
                  name="smtpEmail"
                  placeholder="notifications@apexcrm.com"
                  value={settings.smtpEmail || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="primary-btn">
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;