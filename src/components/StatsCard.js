import React from 'react';
import { FaUser, FaClock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function StatsCard({ icon: Icon, label, value, color = '#2563eb' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ color }}>
        <Icon />
      </div>
      <h3>{label}</h3>
      <div className="value">{value}</div>
    </div>
  );
}

export default StatsCard;
