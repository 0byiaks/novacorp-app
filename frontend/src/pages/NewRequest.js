import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  main: { maxWidth: '680px', margin: '0 auto', padding: '40px 24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#0A1628', letterSpacing: '-0.5px', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginBottom: '32px' },
  card: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '40px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
    borderRadius: '8px', fontSize: '14px', color: '#1E293B', outline: 'none', marginBottom: '20px',
  },
  textarea: {
    width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
    borderRadius: '8px', fontSize: '14px', color: '#1E293B', outline: 'none',
    marginBottom: '20px', minHeight: '120px', resize: 'vertical',
  },
  select: {
    width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
    borderRadius: '8px', fontSize: '14px', color: '#1E293B', outline: 'none', marginBottom: '20px',
  },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '12px 24px', background: 'transparent', border: '1px solid #E2E8F0',
    borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#64748B',
  },
  submitBtn: {
    padding: '12px 24px', background: '#2563EB', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  error: { background: '#FEF2F2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px' },
};

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', service_type: '', priority: 'medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await client.post('/requests/', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.title}>New infrastructure request</div>
        <div style={styles.subtitle}>Tell us what you need and we'll get back to you within one business day.</div>
        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Request title</label>
            <input style={styles.input} type="text" placeholder="e.g. Set up EKS cluster for production"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

            <label style={styles.label}>Service type</label>
            <select style={styles.select} value={form.service_type}
              onChange={e => setForm({ ...form, service_type: e.target.value })} required>
              <option value="">Select a service</option>
              <option value="Cloud Architecture">Cloud Architecture</option>
              <option value="Infrastructure as Code">Infrastructure as Code</option>
              <option value="CI/CD Pipelines">CI/CD Pipelines</option>
              <option value="Kubernetes">Kubernetes</option>
              <option value="Observability">Observability</option>
              <option value="Other">Other</option>
            </select>

            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea}
              placeholder="Describe your infrastructure challenge and what you're trying to achieve..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

            <div style={styles.actions}>
              <button type="button" style={styles.cancelBtn} onClick={() => navigate('/dashboard')}>Cancel</button>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}