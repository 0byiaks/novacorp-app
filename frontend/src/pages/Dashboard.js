import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

const statusColors = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  in_review: { bg: '#DBEAFE', color: '#1E40AF' },
  in_progress: { bg: '#EDE9FE', color: '#5B21B6' },
  completed: { bg: '#D1FAE5', color: '#065F46' },
  rejected: { bg: '#FEE2E2', color: '#991B1B' },
};

const priorityColors = {
  low: { bg: '#F0FDF4', color: '#166534' },
  medium: { bg: '#FEF9C3', color: '#854D0E' },
  high: { bg: '#FEF2F2', color: '#991B1B' },
};

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  main: { maxWidth: '1160px', margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#0A1628', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  newBtn: {
    background: '#2563EB', color: '#fff', padding: '10px 20px',
    borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
  },
  empty: { textAlign: 'center', padding: '80px 24px', color: '#64748B' },
  emptyTitle: { fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' },
  table: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' },
  thead: { background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textAlign: 'left' },
  td: { padding: '16px 20px', fontSize: '14px', color: '#1E293B', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '500' },
};

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    client.get('/requests/').then(({ data }) => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Welcome back, {user.full_name?.split(' ')[0]}</div>
            <div style={styles.subtitle}>Your infrastructure requests</div>
          </div>
          <Link to="/new-request" style={styles.newBtn}>New request</Link>
        </div>

        {loading ? (
          <div style={styles.empty}><div style={styles.emptyTitle}>Loading...</div></div>
        ) : requests.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyTitle}>No requests yet</div>
            <div style={{ marginBottom: '24px' }}>Submit your first infrastructure request to get started.</div>
            <Link to="/new-request" style={styles.newBtn}>Submit a request</Link>
          </div>
        ) : (
          <div style={styles.table}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: '500' }}>{req.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {req.description.substring(0, 60)}...
                      </div>
                    </td>
                    <td style={styles.td}>{req.service_type}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...priorityColors[req.priority] }}>
                        {req.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusColors[req.status] }}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(req.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}