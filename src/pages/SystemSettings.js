import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { settingsAPI } from '../services/api';

function SystemSettings() {
  const [settings, setSettings] = useState({
    clinicName: 'AI Doctor Appointment System',
    clinicEmail: 'info@clinic.com',
    clinicPhone: '+1-800-000-0000',
    timezone: 'UTC',
    appointmentDuration: 30,
    enableNotifications: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await settingsAPI.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
      <Navbar title="System Settings" />

      <div className="content-card">
        {saved && (
          <div
            style={{
              padding: 12,
              marginBottom: 20,
              background: '#dcfce7',
              color: '#166534',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <i className="fas fa-check-circle"></i>
            Settings saved successfully!
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <h3 style={{ marginBottom: 25, color: '#1f2937' }}>
              <i className="fas fa-hospital" style={{ marginRight: 10 }}></i>
              Clinic Information
            </h3>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.clinicName}
                  onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.clinicEmail}
                  onChange={(e) => setSettings({ ...settings, clinicEmail: e.target.value })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={settings.clinicPhone}
                  onChange={(e) => setSettings({ ...settings, clinicPhone: e.target.value })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Timezone</label>
                <select
                  className="form-control"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
            </div>

            <hr />

            <h3 style={{ marginBottom: 25, marginTop: 30, color: '#1f2937' }}>
              <i className="fas fa-cog" style={{ marginRight: 10 }}></i>
              Appointment Settings
            </h3>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Default Appointment Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.appointmentDuration}
                  onChange={(e) =>
                    setSettings({ ...settings, appointmentDuration: e.target.value })
                  }
                />
              </div>
            </div>

            <hr />

            <h3 style={{ marginBottom: 25, marginTop: 30, color: '#1f2937' }}>
              <i className="fas fa-bell" style={{ marginRight: 10 }}></i>
              Notifications & System
            </h3>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, enableNotifications: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="enableNotifications">
                  Enable Email Notifications
                </label>
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenanceMode: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="maintenanceMode">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              <i className="fas fa-save" style={{ marginRight: 8 }}></i>
              Save Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SystemSettings;
