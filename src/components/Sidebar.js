import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaUserMd,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/dashboard', icon: FaChartLine, label: 'Dashboard' },
    { path: '/doctors', icon: FaUserMd, label: 'Doctors' },
    { path: '/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/patients', icon: FaUsers, label: 'Patients' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h3>
          <i className="fas fa-hospital"></i> Admin Panel
        </h3>
        <p>Doctor Appointment System</p>
      </div>

      <ul className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          paddingLeft: 20,
          paddingRight: 20,
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: 20,
        }}
      >
        <button
          onClick={handleLogout}
          className="btn btn-light w-100"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
