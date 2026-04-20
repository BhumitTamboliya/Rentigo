import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './VehicleDetail.css';

const typeIcon = { '2-Wheeler': '🏍️', '4-Wheeler': '🚗' };

const getImageUrl = (src) => {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `http://localhost:5000${src}`;
};

export default function VehicleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({
    startDate: '', endDate: '', rentalType: 'daily', pickupLocation: '', notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    axios.get(`/api/vehicles/${id}`)
      .then(r => { setVehicle(r.data); setLoading(false); })
      .catch(() => navigate('/vehicles'));
  }, [id]);

  useEffect(() => {
    if (vehicle && booking.startDate && booking.endDate) {
      const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000);
      if (days > 0) {
        let amount = 0;
        if (booking.rentalType === 'monthly') amount = vehicle.pricing.monthly * Math.ceil(days / 30);
        else if (booking.rentalType === 'weekly') amount = vehicle.pricing.weekly * Math.ceil(days / 7);
        else amount = vehicle.pricing.daily * days;
        setTotalAmount(amount);
      }
    }
  }, [booking, vehicle]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); return navigate('/login'); }
    if (user.role !== 'customer') return toast.error('Only customers can book vehicles');
    if (!booking.startDate || !booking.endDate) return toast.error('Select dates');
    if (new Date(booking.startDate) >= new Date(booking.endDate)) return toast.error('Invalid date range');
    setBookingLoading(true);
    try {
      await axios.post('/api/bookings', { vehicleId: id, ...booking });
      toast.success('Booking request sent! ✅');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-center" style={{ marginTop: '70px' }}><div className="spinner"></div></div>;
  if (!vehicle) return null;

  const today = new Date().toISOString().split('T')[0];
  const images = (vehicle.images || []).filter(Boolean).map(getImageUrl);

  return (
    <div className="detail-page">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-layout">
          {/* LEFT */}
          <div className="detail-left animate-fadeInUp">

            {/* Main Image */}
            <div className="detail-img-wrap">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${vehicle.brand} ${vehicle.model}`} className="detail-img" />
              ) : (
                <div className="detail-img-placeholder">{typeIcon[vehicle.type]}</div>
              )}
              <span className={`badge ${vehicle.availabilityStatus === 'available' ? 'badge-success' : 'badge-error'} detail-status`}>
                {vehicle.availabilityStatus}
              </span>
              {images.length > 1 && (
                <>
                  <button className="img-nav prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>‹</button>
                  <button className="img-nav next" onClick={() => setActiveImg(i => (i + 1) % images.length)}>›</button>
                  <div className="img-counter">{activeImg + 1} / {images.length}</div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((src, i) => (
                  <div key={i} className={`thumbnail ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={src} alt={`View ${i + 1}`} />
                    {i === 0 && <span className="thumb-label">Front</span>}
                    {i === 1 && <span className="thumb-label">Back</span>}
                    {i === 2 && <span className="thumb-label">Side</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="detail-info card">
              <div className="detail-title-row">
                <div>
                  <h1 className="detail-title">{vehicle.brand} {vehicle.model}</h1>
                  <p className="detail-subtitle">{vehicle.modelYear} • {vehicle.location?.city}</p>
                </div>
                <span className="badge badge-accent">{vehicle.type}</span>
              </div>

              {vehicle.description && <p className="detail-desc">{vehicle.description}</p>}

              <div className="specs-grid">
                <div className="spec-item"><span className="spec-label">Fuel</span><span className="spec-val">⛽ {vehicle.fuelType}</span></div>
                <div className="spec-item"><span className="spec-label">Transmission</span><span className="spec-val">⚙️ {vehicle.transmission}</span></div>
                <div className="spec-item"><span className="spec-label">Seats</span><span className="spec-val">👥 {vehicle.seatingCapacity}</span></div>
                <div className="spec-item"><span className="spec-label">Vehicle No.</span><span className="spec-val">🔖 {vehicle.vehicleNumber}</span></div>
                <div className="spec-item"><span className="spec-label">Color</span><span className="spec-val">🎨 {vehicle.color || 'N/A'}</span></div>
                <div className="spec-item"><span className="spec-label">City</span><span className="spec-val">📍 {vehicle.location?.city}</span></div>
              </div>

              <div className="pricing-row">
                <div className="pricing-box">
                  <span className="p-amount">₹{vehicle.pricing.daily}</span>
                  <span className="p-label">Per Day</span>
                </div>
                <div className="pricing-box">
                  <span className="p-amount">₹{vehicle.pricing.weekly}</span>
                  <span className="p-label">Per Week</span>
                </div>
                <div className="pricing-box">
                  <span className="p-amount">₹{vehicle.pricing.monthly}</span>
                  <span className="p-label">Per Month</span>
                </div>
              </div>

              {vehicle.owner && (
                <div className="owner-box">
                  <div className="owner-avatar">{vehicle.owner.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="owner-name">{vehicle.owner.name}</p>
                    <p className="owner-label">Vehicle Owner</p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <a href={`tel:${vehicle.owner.phone}`} className="btn btn-ghost btn-sm">📞 Call</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Booking */}
          <div className="detail-right animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <div className="booking-card card">
              <h2 className="booking-title">Book This Vehicle</h2>
              {vehicle.availabilityStatus !== 'available' ? (
                <div className="alert alert-error">This vehicle is currently not available.</div>
              ) : (
                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label className="form-label">Rental Plan</label>
                    <div className="rental-types">
                      {['daily', 'weekly', 'monthly'].map(rt => (
                        <button key={rt} type="button"
                          className={`rental-type-btn ${booking.rentalType === rt ? 'active' : ''}`}
                          onClick={() => setBooking({ ...booking, rentalType: rt })}>
                          {rt.charAt(0).toUpperCase() + rt.slice(1)}
                          <span>₹{vehicle.pricing[rt]}{rt === 'daily' ? '/d' : rt === 'weekly' ? '/wk' : '/mo'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="date-row">
                    <div className="form-group">
                      <label className="form-label">Pickup Date</label>
                      <input type="date" required className="form-input" min={today}
                        value={booking.startDate} onChange={e => setBooking({ ...booking, startDate: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Return Date</label>
                      <input type="date" required className="form-input" min={booking.startDate || today}
                        value={booking.endDate} onChange={e => setBooking({ ...booking, endDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pickup Location</label>
                    <input className="form-input" placeholder="Where to pick up?"
                      value={booking.pickupLocation} onChange={e => setBooking({ ...booking, pickupLocation: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes (optional)</label>
                    <textarea className="form-input" rows={3} placeholder="Any special requirements..."
                      value={booking.notes} onChange={e => setBooking({ ...booking, notes: e.target.value })} />
                  </div>
                  {totalAmount > 0 && (
                    <div className="total-box">
                      <span>Estimated Total</span>
                      <span className="total-amount">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                    disabled={bookingLoading || !user || user.role !== 'customer'}>
                    {!user ? 'Login to Book' : user.role !== 'customer' ? 'Only Customers Can Book' : bookingLoading ? 'Sending...' : 'Send Booking Request →'}
                  </button>
                  {!user && (
                    <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <a href="/login" style={{ color: 'var(--accent)' }}>Login</a> or <a href="/register" style={{ color: 'var(--accent)' }}>Register</a> to book
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}