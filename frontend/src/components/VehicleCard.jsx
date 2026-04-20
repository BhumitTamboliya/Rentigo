import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import './VehicleCard.css';

const typeIcon = { '2-Wheeler': '🏍️', '4-Wheeler': '🚗' };

export default function VehicleCard({ vehicle }) {
  const statusBadge = {
    available: 'badge-success',
    booked: 'badge-error',
    maintenance: 'badge-warning',
  };

  const mainImage = vehicle.images?.length > 0 ? getImageUrl(vehicle.images[0]) : null;

  return (
    <div className="vehicle-card">
      <div className="vehicle-img-wrap">
        {mainImage ? (
          <img src={mainImage} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-img"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
        ) : null}
        <div className="vehicle-img-placeholder" style={{ display: mainImage ? 'none' : 'flex' }}>
          <span>{typeIcon[vehicle.type] || '🚗'}</span>
        </div>
        <div className="vehicle-type-badge">{vehicle.type}</div>
        <span className={`badge ${statusBadge[vehicle.availabilityStatus] || 'badge-muted'} status-badge`}>
          {vehicle.availabilityStatus}
        </span>
      </div>

      <div className="vehicle-card-body">
        <div>
          <h3 className="vehicle-name">{vehicle.brand} {vehicle.model}</h3>
          <p className="vehicle-meta">{vehicle.modelYear} • {vehicle.location?.city}</p>
        </div>

        <div className="vehicle-specs">
          <span className="spec-pill">⛽ {vehicle.fuelType}</span>
          <span className="spec-pill">⚙️ {vehicle.transmission}</span>
          {vehicle.seatingCapacity && <span className="spec-pill">👥 {vehicle.seatingCapacity} seats</span>}
        </div>

        <div className="vehicle-pricing">
          <div className="price-item">
            <span className="price-val">₹{vehicle.pricing?.daily}</span>
            <span className="price-period">/day</span>
          </div>
          <div className="price-item dim">
            <span className="price-val">₹{vehicle.pricing?.weekly}</span>
            <span className="price-period">/week</span>
          </div>
          <div className="price-item dim">
            <span className="price-val">₹{vehicle.pricing?.monthly}</span>
            <span className="price-period">/mo</span>
          </div>
        </div>

        <Link to={`/vehicles/${vehicle._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          View Details →
        </Link>
      </div>
    </div>
  );
}