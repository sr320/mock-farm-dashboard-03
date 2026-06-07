import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-top">
          <div>
            <h1>Shellfish Farm Outplant Dashboard</h1>
            <p className="subtitle">
              Mock multi-year monitoring data across shellfish farm sites and
              priming treatments
            </p>
          </div>
          <nav className="header-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Site Map
            </NavLink>
          </nav>
        </div>
        <p className="disclaimer">
          All data shown are simulated for demonstration purposes and do not
          represent actual field measurements.
        </p>
      </div>
    </header>
  );
}
