import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb"></div>
      </div>
      <div className="auth-card animate-fadeInUp">
        <div className="auth-logo">🚗 <span style={{ fontFamily: 'Syne', fontWeight: 800 }}>Renti<span style={{ color: 'var(--accent)' }}>Go</span></span></div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" required
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" required
              className="form-input"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        <div className="demo-creds">
          <p>🔑 Demo Accounts:</p>
          <div className="demo-list">
            <span>Admin: admin@rentigo.com / admin123</span>
            <span>Owner: owner@rentigo.com / owner123</span>
            <span>Customer: customer@rentigo.com / cust123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
