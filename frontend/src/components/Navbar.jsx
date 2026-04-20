import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Renti<span className="logo-go">Go</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/vehicles" className={`nav-link ${isActive('/vehicles') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Browse</Link>

          {user && user.role === 'customer' && (
            <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          )}
          {user && user.role === 'owner' && (
            <>
              <Link to="/owner/dashboard" className={`nav-link ${isActive('/owner/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/owner/add-vehicle" className={`nav-link ${isActive('/owner/add-vehicle') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Add Vehicle</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}

          {!user ? (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          ) : (
            <div className="nav-user">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
