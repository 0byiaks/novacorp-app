import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import client from '../api/client';

const statusColors = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  in_review: { bg: '#DBEAFE', color: '#1E40AF' },
  in_progress: { bg: '#EDE9FE', color: '#5B21B6' },
  completed: { bg: '#D1FAE5', color: '#065F46' },
  rejected: { bg: '#FEE2E2', color: '#991B1B' },
};

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  main: { maxWidth: '1160px', margin: '0 auto', padding: '40px 24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#0A1628', letterSpacing: '-0.5px', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginBottom: '32px' },
  table: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' },
  thead: { background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textAlign: 'left' },
  td: { padding: '16px 20px', fontSize: '14px', color: '#1E293B', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '500' },
  select: {
    padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px',
    fontSize: '13px', color: '#1E293B', outline: 'none', cursor: 'pointer',
  },
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/requests/').then(({ data }) => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await client.patch(`/requests/${id}`, { status });
      setRequests(requests.map(r => r.id === id ? data : r));
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.title}>Admin Dashboard</div>
        <div style={styles.subtitle}>All client infrastructure requests</div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={styles.table}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Client</th>
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
                        {req.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div>{req.owner.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{req.owner.company}</div>
                    </td>
                    <td style={styles.td}>{req.service_type}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: '#F1F5F9', color: '#475569' }}>
                        {req.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select style={styles.select} value={req.status}
                        onChange={e => updateStatus(req.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in_review">In review</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
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