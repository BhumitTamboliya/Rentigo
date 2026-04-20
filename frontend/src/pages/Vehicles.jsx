import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import './Vehicles.css';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    fuelType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    rentalType: 'daily',
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await axios.get(`/api/vehicles?${params}`);
      setVehicles(res.data);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const resetFilters = () => {
    setFilters({ search: '', type: '', fuelType: '', city: '', minPrice: '', maxPrice: '', rentalType: 'daily' });
    setSearchParams({});
    setTimeout(fetchVehicles, 50);
  };

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <div className="container">
          <h1 className="section-title">Browse <span className="glow-text">Vehicles</span></h1>
          <p className="section-subtitle">{vehicles.length} vehicles available right now</p>
        </div>
      </div>

      <div className="container vehicles-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar animate-fadeIn">
          <div className="filters-card card">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset</button>
            </div>

            <form onSubmit={handleFilter}>
              <div className="form-group">
                <label className="form-label">Search</label>
                <input className="form-input" placeholder="Brand, model..."
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="Enter city..."
                  value={filters.city}
                  onChange={e => setFilters({ ...filters, city: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-input" value={filters.type}
                  onChange={e => setFilters({ ...filters, type: e.target.value })}>
                  <option value="">All Types</option>
                  <option value="2-Wheeler">2-Wheeler</option>
                  <option value="4-Wheeler">4-Wheeler</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select className="form-input" value={filters.fuelType}
                  onChange={e => setFilters({ ...filters, fuelType: e.target.value })}>
                  <option value="">All Fuels</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price Plan</label>
                <select className="form-input" value={filters.rentalType}
                  onChange={e => setFilters({ ...filters, rentalType: e.target.value })}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price Range (₹)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" type="number" placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                  <input className="form-input" type="number" placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Vehicle Grid */}
        <main className="vehicles-main">
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🚗</div>
              <h3>No vehicles found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="vehicles-grid stagger-children">
              {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
