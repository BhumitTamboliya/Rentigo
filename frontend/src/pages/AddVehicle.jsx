import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddVehicle.css';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    vehicleNumber: '', brand: '', model: '', type: '4-Wheeler',
    modelYear: new Date().getFullYear(), fuelType: 'Petrol',
    transmission: 'Manual', seatingCapacity: 4, color: '',
    description: '',
    pricing: { daily: '', weekly: '', monthly: '' },
    location: { city: '', address: '' },
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNested = (key, sub, val) => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: val } }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pricing.daily || !form.pricing.weekly || !form.pricing.monthly) {
      return toast.error('Please enter all pricing fields');
    }
    if (!form.location.city) return toast.error('Please enter city');

    setLoading(true);
    try {
      // Use FormData to send files + text together
      const formData = new FormData();

      // Text fields
      formData.append('vehicleNumber', form.vehicleNumber);
      formData.append('brand', form.brand);
      formData.append('model', form.model);
      formData.append('type', form.type);
      formData.append('modelYear', form.modelYear);
      formData.append('fuelType', form.fuelType);
      formData.append('transmission', form.transmission);
      formData.append('seatingCapacity', form.seatingCapacity);
      formData.append('color', form.color);
      formData.append('description', form.description);

      // Nested objects as JSON strings
      formData.append('pricing', JSON.stringify(form.pricing));
      formData.append('location', JSON.stringify(form.location));

      // Image files
      imageFiles.forEach(file => formData.append('images', file));

      await axios.post('/api/vehicles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Vehicle submitted for approval! ✅');
      navigate('/owner/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">
      <div className="container">
        <div className="av-header">
          <h1 className="section-title">Add <span className="glow-text">Vehicle</span></h1>
          <p className="section-subtitle">List your vehicle and start earning</p>
        </div>

        <form onSubmit={handleSubmit} className="av-form animate-fadeInUp">

          {/* Images Upload */}
          <div className="av-section card">
            <h3 className="av-section-title">📸 Vehicle Photos</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Upload up to 6 photos — front, back, side, interior, etc.
            </p>

            {imagePreviews.length === 0 ? (
              <label className="upload-area">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                <div className="upload-icon">📷</div>
                <div className="upload-text">Click to upload photos</div>
                <div className="upload-sub">JPG, PNG, WEBP • Max 6 images • 5MB each</div>
              </label>
            ) : (
              <div className="image-preview-grid">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="preview-item">
                    <img src={src} alt={`Vehicle ${i + 1}`} className="preview-img" />
                    <div className="preview-overlay">
                      {i === 0 && <span className="main-badge">Main</span>}
                      <button type="button" className="remove-img-btn" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  </div>
                ))}
                {imagePreviews.length < 6 && (
                  <label className="add-more-btn">
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                    <span style={{ fontSize: '1.8rem' }}>+</span>
                    <span style={{ fontSize: '0.75rem' }}>Add More</span>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="av-section card">
            <h3 className="av-section-title">🚗 Vehicle Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Vehicle Number *</label>
                <input required className="form-input" placeholder="MH12AB1234" style={{ textTransform: 'uppercase' }}
                  value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value.toUpperCase())} />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Type *</label>
                <select required className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="4-Wheeler">4-Wheeler</option>
                  <option value="2-Wheeler">2-Wheeler</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand *</label>
                <input required className="form-input" placeholder="Honda / Toyota"
                  value={form.brand} onChange={e => set('brand', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Model *</label>
                <input required className="form-input" placeholder="Activa / Swift"
                  value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Model Year *</label>
                <input required type="number" className="form-input" min="2000" max={new Date().getFullYear()}
                  value={form.modelYear} onChange={e => set('modelYear', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input className="form-input" placeholder="White / Black"
                  value={form.color} onChange={e => set('color', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Fuel Type *</label>
                <select required className="form-input" value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
                  {['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Transmission *</label>
                <select required className="form-input" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Seating Capacity</label>
                <input type="number" className="form-input" min="1" max="12"
                  value={form.seatingCapacity} onChange={e => set('seatingCapacity', Number(e.target.value))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} placeholder="Tell renters about your vehicle..."
                value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
          </div>

          {/* Pricing */}
          <div className="av-section card">
            <h3 className="av-section-title">💰 Pricing Plans</h3>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Daily Rate (₹) *</label>
                <input required type="number" className="form-input" placeholder="500"
                  value={form.pricing.daily} onChange={e => setNested('pricing', 'daily', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Weekly Rate (₹) *</label>
                <input required type="number" className="form-input" placeholder="3000"
                  value={form.pricing.weekly} onChange={e => setNested('pricing', 'weekly', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Rate (₹) *</label>
                <input required type="number" className="form-input" placeholder="10000"
                  value={form.pricing.monthly} onChange={e => setNested('pricing', 'monthly', e.target.value)} />
              </div>
            </div>
            <div className="pricing-hint">💡 Weekly ~6x daily, Monthly ~20x daily for better conversions</div>
          </div>

          {/* Location */}
          <div className="av-section card">
            <h3 className="av-section-title">📍 Location</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input required className="form-input" placeholder="Mumbai"
                  value={form.location.city} onChange={e => setNested('location', 'city', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Address (optional)</label>
                <input className="form-input" placeholder="Pickup address"
                  value={form.location.address} onChange={e => setNested('location', 'address', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="av-submit">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Uploading...' : 'Submit for Approval →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}