import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0A1628',
    marginBottom: '8px',
  },
  logoSpan: { color: '#2563EB' },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    marginBottom: '16px',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    background: '#FEF2F2',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#64748B',
  },
  footerLink: { color: '#2563EB', textDecoration: 'none', fontWeight: '500' },
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data: tokenData } = await client.post('/auth/login', form);
      localStorage.setItem('token', tokenData.access_token);

      const { data: userData } = await client.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Nova<span style={styles.logoSpan}>Corp</span></div>
        <div style={styles.subtitle}>Sign in to your client portal</div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div style={styles.footer}>
          No account? <Link to="/register" style={styles.footerLink}>Create one</Link>
        </div>
      </div>
    </div>
  );
}