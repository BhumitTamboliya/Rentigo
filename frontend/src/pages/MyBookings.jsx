import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MyBookings.css';

const statusClass = {
  pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error',
  active: 'badge-info', completed: 'badge-success', cancelled: 'badge-muted'
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/my-bookings');
      setBookings(res.data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.patch(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="loading-center" style={{ marginTop: '100px' }}><div className="spinner"></div></div>;

  return (
    <div className="mybookings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">My <span className="glow-text">Bookings</span></h1>
          <p className="section-subtitle">{bookings.length} total bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No bookings yet</h3>
            <p>Browse and book a vehicle to get started!</p>
            <a href="/vehicles" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Vehicles</a>
          </div>
        ) : (
          <div className="bookings-list stagger-children">
            {bookings.map(b => (
              <div key={b._id} className="booking-card-item card">
                <div className="booking-vehicle-info">
                  <div className="bv-icon">{b.vehicle?.type === '2-Wheeler' ? '🏍️' : '🚗'}</div>
                  <div>
                    <h3 className="bv-name">{b.vehicle?.brand} {b.vehicle?.model}</h3>
                    <p className="bv-num">#{b.vehicle?.vehicleNumber}</p>
                  </div>
                  <span className={`badge ${statusClass[b.status]} ml-auto`}>{b.status}</span>
                </div>

                <div className="booking-details-grid">
                  <div className="bd-item">
                    <span className="bd-label">Dates</span>
                    <span className="bd-val">
                      {new Date(b.startDate).toLocaleDateString('en-IN')} → {new Date(b.endDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-label">Duration</span>
                    <span className="bd-val">{b.totalDays} days ({b.rentalType})</span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-label">Total Amount</span>
                    <span className="bd-val" style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{b.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-label">Owner</span>
                    <span className="bd-val">{b.owner?.name} • {b.owner?.phone}</span>
                  </div>
                </div>

                {b.rejectionReason && (
                  <div className="alert alert-error" style={{ marginTop: '12px' }}>
                    Rejected: {b.rejectionReason}
                  </div>
                )}

                {(b.status === 'pending' || b.status === 'approved') && (
                  <div className="booking-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b._id)}>Cancel Booking</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
