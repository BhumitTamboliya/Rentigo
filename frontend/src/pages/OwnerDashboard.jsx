import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUrl';
import './OwnerDashboard.css';

const statusClass = {
  pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error',
  active: 'badge-info', completed: 'badge-success', cancelled: 'badge-muted'
};

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [dashRes, vehiclesRes, bookingsRes] = await Promise.all([
        axios.get('/api/dashboard/owner'),
        axios.get('/api/vehicles/owner/my-fleet'),
        axios.get('/api/bookings/owner-bookings'),
      ]);
      setStats(dashRes.data.stats);
      setRecentBookings(dashRes.data.recentBookings);
      setVehicles(vehiclesRes.data);
      setAllBookings(bookingsRes.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleBookingStatus = async (id, status, reason = '') => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status, rejectionReason: reason });
      toast.success(`Booking ${status}!`);
      fetchDashboard();
    } catch { toast.error('Action failed'); }
  };

  const handleVehicleStatus = async (id, status) => {
    try {
      await axios.patch(`/api/vehicles/${id}/status`, { status });
      toast.success('Status updated');
      fetchDashboard();
    } catch { toast.error('Failed to update'); }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await axios.delete(`/api/vehicles/${id}`);
      toast.success('Vehicle deleted');
      fetchDashboard();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-center" style={{ marginTop: '100px' }}><div className="spinner"></div></div>;

  return (
    <div className="owner-dashboard">
      <div className="container">
        <div className="dash-header">
          <div>
            <h1 className="section-title">Owner <span className="glow-text">Dashboard</span></h1>
            <p className="section-subtitle">Manage your fleet and bookings</p>
          </div>
          <Link to="/owner/add-vehicle" className="btn btn-primary">+ Add Vehicle</Link>
        </div>

        {stats && (
          <div className="stats-row stagger-children">
            {[
              { icon: '🚗', label: 'My Vehicles', val: stats.myVehicles },
              { icon: '✅', label: 'Available', val: stats.availableVehicles },
              { icon: '🔖', label: 'Booked', val: stats.bookedVehicles },
              { icon: '⏳', label: 'Pending', val: stats.pendingBookings },
              { icon: '🟢', label: 'Active', val: stats.activeBookings },
              { icon: '💰', label: 'Revenue', val: `₹${stats.totalRevenue?.toLocaleString()}` },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="tabs">
          {['overview', 'bookings', 'fleet'].map(t => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="animate-fadeIn">
            <h3 style={{ marginBottom: '16px', fontFamily: 'Syne' }}>Recent Bookings</h3>
            {recentBookings.length === 0 ? (
              <div className="empty-state"><div className="icon">📋</div><h3>No bookings yet</h3></div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {recentBookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.customer?.name}<br /><small style={{ color: 'var(--text-muted)' }}>{b.customer?.phone}</small></td>
                        <td>{b.vehicle?.brand} {b.vehicle?.model}</td>
                        <td style={{ fontSize: '0.82rem' }}>
                          {new Date(b.startDate).toLocaleDateString('en-IN')} →<br />
                          {new Date(b.endDate).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{b.totalAmount?.toLocaleString()}</td>
                        <td><span className={`badge ${statusClass[b.status]}`}>{b.status}</span></td>
                        <td>
                          {b.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button className="btn btn-primary btn-sm" onClick={() => handleBookingStatus(b._id, 'approved')}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => {
                                const r = prompt('Rejection reason:');
                                if (r !== null) handleBookingStatus(b._id, 'rejected', r);
                              }}>Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="animate-fadeIn">
            <h3 style={{ marginBottom: '16px', fontFamily: 'Syne' }}>All Bookings ({allBookings.length})</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Customer</th><th>Vehicle</th><th>Type</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {allBookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.customer?.name}<br /><small style={{ color: 'var(--text-muted)' }}>{b.customer?.email}</small></td>
                      <td>{b.vehicle?.brand} {b.vehicle?.model}<br /><small style={{ color: 'var(--text-muted)' }}>{b.vehicle?.vehicleNumber}</small></td>
                      <td><span className="badge badge-muted">{b.rentalType}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {new Date(b.startDate).toLocaleDateString('en-IN')} →<br />
                        {new Date(b.endDate).toLocaleDateString('en-IN')}<br />
                        <small style={{ color: 'var(--text-muted)' }}>{b.totalDays} days</small>
                      </td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td><span className={`badge ${statusClass[b.status]}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleBookingStatus(b._id, 'approved')}>✓</button>
                            <button className="btn btn-danger btn-sm" onClick={() => {
                              const r = prompt('Rejection reason:');
                              if (r !== null) handleBookingStatus(b._id, 'rejected', r);
                            }}>✗</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'fleet' && (
          <div className="animate-fadeIn">
            <h3 style={{ marginBottom: '16px', fontFamily: 'Syne' }}>My Fleet ({vehicles.length})</h3>
            {vehicles.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🚗</div>
                <h3>No vehicles yet</h3>
                <Link to="/owner/add-vehicle" className="btn btn-primary" style={{ marginTop: '16px' }}>Add Your First Vehicle</Link>
              </div>
            ) : (
              <div className="fleet-grid stagger-children">
                {vehicles.map(v => {
                  const imgSrc = v.images?.length > 0 ? getImageUrl(v.images[0]) : null;
                  return (
                    <div key={v._id} className="fleet-card card">
                      <div className="fleet-img-wrap">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="fleet-img"
                            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                          />
                        ) : null}
                        <div className="fleet-img-ph" style={{ display: imgSrc ? 'none' : 'flex' }}>
                          {v.type === '2-Wheeler' ? '🏍️' : '🚗'}
                        </div>
                      </div>
                      <div className="fleet-info">
                        <div className="fleet-name">{v.brand} {v.model} ({v.modelYear})</div>
                        <div className="fleet-num">{v.vehicleNumber}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                          <span className={`badge ${v.isApproved ? 'badge-success' : 'badge-warning'}`}>
                            {v.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          <span className={`badge ${v.availabilityStatus === 'available' ? 'badge-info' : 'badge-muted'}`}>
                            {v.availabilityStatus}
                          </span>
                        </div>
                        <div className="fleet-pricing">
                          <span>₹{v.pricing?.daily}/day</span>
                          <span>₹{v.pricing?.weekly}/week</span>
                          <span>₹{v.pricing?.monthly}/mo</span>
                        </div>
                        <div className="fleet-actions">
                          <select className="form-input" style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                            value={v.availabilityStatus}
                            onChange={e => handleVehicleStatus(v._id, e.target.value)}>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteVehicle(v._id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}