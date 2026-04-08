import React from 'react';

function Navbar({ title }) {
  return (
    <div className="navbar-top">
      <h1 className="page-title">{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {localStorage.getItem('adminUser') || 'Admin'}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Administrator</p>
        </div>
        <div
          style={{
            width: 45,
            height: 45,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
          }}
        >
          <i className="fas fa-user"></i>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
