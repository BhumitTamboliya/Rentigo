import { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const statusClass = {
  pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error',
  active: 'badge-info', completed: 'badge-success', cancelled: 'badge-muted'
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, pendingRes, bookingsRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/pending-vehicles'),
        axios.get('/api/bookings/all'),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setPendingVehicles(pendingRes.data);
      setAllBookings(bookingsRes.data);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const approveVehicle = async (id, isApproved) => {
    try {
      await axios.patch(`/api/admin/vehicles/${id}/approve`, { isApproved });
      toast.success(isApproved ? 'Vehicle approved ✅' : 'Vehicle rejected');
      fetchAll();
    } catch { toast.error('Action failed'); }
  };

  const changeUserRole = async (id, role) => {
    try {
      await axios.patch(`/api/admin/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchAll();
    } catch { toast.error('Failed to update role'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-center" style={{ marginTop: '100px' }}><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin <span className="glow-text">Dashboard</span></h1>
            <p className="section-subtitle">Full system control panel</p>
          </div>
          <div className="admin-badge">
            <span>🛡️ Super Admin</span>
          </div>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="analytics-grid stagger-children">
            {[
              { icon: '👥', label: 'Total Customers', val: analytics.totalUsers, color: '#06b6d4' },
              { icon: '🏢', label: 'Total Owners', val: analytics.totalOwners, color: '#a855f7' },
              { icon: '🚗', label: 'Active Vehicles', val: analytics.totalVehicles, color: '#22c55e' },
              { icon: '📋', label: 'Total Bookings', val: analytics.totalBookings, color: '#f97316' },
              { icon: '⏳', label: 'Pending', val: analytics.pendingBookings, color: '#eab308' },
              { icon: '✅', label: 'Completed', val: analytics.completedBookings, color: '#22c55e' },
              { icon: '🔴', label: 'Active Now', val: analytics.activeBookings, color: '#ef4444' },
              { icon: '💰', label: 'Total Revenue', val: `₹${analytics.totalRevenue?.toLocaleString()}`, color: '#f97316' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ '--accent-color': s.color }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle type breakdown */}
        {analytics?.vehiclesByType?.length > 0 && (
          <div className="type-breakdown card animate-fadeIn">
            <h3 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Fleet Breakdown</h3>
            <div className="type-bars">
              {analytics.vehiclesByType.map(v => (
                <div key={v._id} className="type-bar-item">
                  <span>{v._id === '2-Wheeler' ? '🏍️' : '🚗'} {v._id}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: `${(v.count / analytics.totalVehicles) * 100}%`
                    }}></div>
                  </div>
                  <span className="bar-count">{v.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {[
            { key: 'overview', label: `⏳ Pending Vehicles (${pendingVehicles.length})` },
            { key: 'bookings', label: `📋 All Bookings (${allBookings.length})` },
            { key: 'users', label: `👥 Users (${users.length})` },
          ].map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PENDING VEHICLES */}
        {tab === 'overview' && (
          <div className="animate-fadeIn">
            {pendingVehicles.length === 0 ? (
              <div className="empty-state">
                <div className="icon">✅</div>
                <h3>No pending approvals</h3>
                <p>All vehicles have been reviewed</p>
              </div>
            ) : (
              <div className="pending-grid stagger-children">
                {pendingVehicles.map(v => (
                  <div key={v._id} className="pending-card card">
                    <div className="pending-img-wrap">
                      {v.images?.length > 0
                        ? <img src={getImageUrl(v.images[0])} alt="" className="pending-img" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
                        : <div className="pending-img-ph">{v.type === '2-Wheeler' ? '🏍️' : '🚗'}</div>
                      }
                      <span className="badge badge-warning" style={{ position: 'absolute', top: 10, right: 10 }}>
                        Pending
                      </span>
                    </div>
                    <div className="pending-info">
                      <h3 className="pending-name">{v.brand} {v.model} ({v.modelYear})</h3>
                      <p className="pending-meta">{v.vehicleNumber} • {v.type} • {v.fuelType}</p>
                      <p className="pending-meta">📍 {v.location?.city}</p>
                      <div className="pending-pricing">
                        <span>₹{v.pricing?.daily}/day</span>
                        <span>₹{v.pricing?.weekly}/wk</span>
                        <span>₹{v.pricing?.monthly}/mo</span>
                      </div>
                      {v.owner && (
                        <div className="pending-owner">
                          <span className="po-avatar">{v.owner.name?.charAt(0)}</span>
                          <div>
                            <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{v.owner.name}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.owner.email}</p>
                          </div>
                        </div>
                      )}
                      <div className="pending-actions">
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                          onClick={() => approveVehicle(v._id, true)}>
                          ✅ Approve
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ flex: 1 }}
                          onClick={() => approveVehicle(v._id, false)}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL BOOKINGS */}
        {tab === 'bookings' && (
          <div className="animate-fadeIn">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Owner</th>
                    <th>Rental Type</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No bookings found</td></tr>
                  ) : allBookings.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customer?.email}</div>
                      </td>
                      <td>
                        <div>{b.vehicle?.brand} {b.vehicle?.model}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.vehicle?.vehicleNumber}</div>
                      </td>
                      <td>{b.owner?.name}</td>
                      <td><span className="badge badge-muted">{b.rentalType}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {new Date(b.startDate).toLocaleDateString('en-IN')} →<br />
                        {new Date(b.endDate).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td><span className={`badge ${statusClass[b.status]}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="animate-fadeIn">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--accent)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0
                          }}>{u.name?.charAt(0).toUpperCase()}</div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-error' : u.role === 'owner' ? 'badge-accent' : 'badge-info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <select className="form-input" style={{ fontSize: '0.78rem', padding: '5px 8px', width: 'auto' }}
                            value={u.role}
                            onChange={e => changeUserRole(u._id, e.target.value)}>
                            <option value="customer">Customer</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}