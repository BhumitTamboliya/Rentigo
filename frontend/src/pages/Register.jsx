import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to RentiGo, ${user.name}! 🎉`);
      if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join thousands riding smarter</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="form-input" placeholder="Rahul Sharma"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="form-input" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="+91 98765 43210"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">I want to</label>
            <div className="role-selector">
              <button type="button"
                className={`role-btn ${form.role === 'customer' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'customer' })}>
                🙋 Rent Vehicles
              </button>
              <button type="button"
                className={`role-btn ${form.role === 'owner' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'owner' })}>
                🏢 List My Fleet
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
