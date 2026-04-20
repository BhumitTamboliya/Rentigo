import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import './Home.css';

const stats = [
  { icon: '🚗', num: '500+', label: 'Vehicles Available' },
  { icon: '🏙️', num: '20+', label: 'Cities Covered' },
  { icon: '👥', num: '10K+', label: 'Happy Customers' },
  { icon: '⭐', num: '4.8', label: 'Average Rating' },
];

const features = [
  { icon: '⚡', title: 'Instant Booking', desc: 'Book your ride in under 2 minutes. No paperwork, no hassle.' },
  { icon: '🔒', title: 'Secure & Trusted', desc: 'Every vehicle and owner is verified by our team.' },
  { icon: '💰', title: 'Best Prices', desc: 'Daily, weekly and monthly plans to suit every budget.' },
  { icon: '📍', title: 'Multi-City', desc: 'Available across 20+ cities and expanding rapidly.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/vehicles?limit=6').then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/vehicles?search=${search}&type=${type}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1"></div>
          <div className="hero-orb orb2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fadeIn">🚀 India's Fastest Growing Rental Platform</div>
          <h1 className="hero-title animate-fadeInUp">
            Rent Any Vehicle,<br />
            <span className="glow-text">Anywhere, Anytime</span>
          </h1>
          <p className="hero-sub animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Browse hundreds of two-wheelers and four-wheelers. Book in seconds. Ride today.
          </p>

          <form className="hero-search animate-fadeInUp" style={{ animationDelay: '0.2s' }} onSubmit={handleSearch}>
            <select
              className="form-input search-select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">All Vehicles</option>
              <option value="2-Wheeler">2-Wheeler</option>
              <option value="4-Wheeler">4-Wheeler</option>
            </select>
            <input
              className="form-input search-input"
              placeholder="Search brand, model or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">
              Search 🔍
            </button>
          </form>

          <div className="hero-tags animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {['Honda Activa', 'Royal Enfield', 'Swift Dzire', 'Innova', 'Pulsar 150'].map(t => (
              <button key={t} className="hero-tag" onClick={() => navigate(`/vehicles?search=${t}`)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid stagger-children">
            {stats.map((s, i) => (
              <div key={i} className="stat-card text-center">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      {featured.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured <span className="glow-text">Vehicles</span></h2>
                <p className="section-subtitle">Handpicked rides for you</p>
              </div>
              <Link to="/vehicles" className="btn btn-outline">View All →</Link>
            </div>
            <div className="grid-3 stagger-children">
              {featured.map(v => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose <span className="glow-text">RentiGo?</span></h2>
          <p className="section-subtitle text-center">Built for speed, trust, and your convenience</p>
          <div className="grid-4 stagger-children" style={{ marginTop: '40px' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="container">
          <h2 className="section-title text-center">How It <span className="glow-text">Works</span></h2>
          <p className="section-subtitle text-center">Rent a vehicle in 4 simple steps</p>
          <div className="steps stagger-children">
            {[
              { n: '01', title: 'Create Account', desc: 'Register in under a minute with your email.' },
              { n: '02', title: 'Browse & Filter', desc: 'Find the perfect vehicle using smart filters.' },
              { n: '03', title: 'Book Instantly', desc: 'Select dates and send your booking request.' },
              { n: '04', title: 'Pick Up & Ride', desc: 'Get approved and hit the road!' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < 3 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb"></div>
            <h2>Ready to Ride?</h2>
            <p>Join thousands of customers renting smarter with RentiGo.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn btn-primary">Get Started Free →</Link>
              <Link to="/vehicles" className="btn btn-ghost">Browse Vehicles</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-text" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem' }}>
                Renti<span style={{ color: 'var(--accent)' }}>Go</span>
              </span>
              <p>India's modern vehicle rental platform.</p>
            </div>
            <div className="footer-links">
              <Link to="/vehicles">Browse</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 RentiGo. Built with ❤️ for smooth rides.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
