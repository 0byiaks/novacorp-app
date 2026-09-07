import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  nav: {
    background: '#0A1628',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
  },
  logoSpan: { color: '#3B82F6' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    listStyle: 'none',
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.7)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>
        Nova<span style={styles.logoSpan}>Corp</span>
      </Link>
      <ul style={styles.links}>
        <li>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        </li>
        {user.role === 'admin' && (
          <li>
            <Link to="/admin" style={styles.link}>Admin</Link>
          </li>
        )}
        <li>
          <Link to="/new-request" style={styles.link}>New Request</Link>
        </li>
        <li style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          {user.full_name}
        </li>
        <li>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}