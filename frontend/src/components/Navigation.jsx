import { Upload, MapPin, Award, TrendingUp, Coins } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import './Navigation.css'

const Navigation = ({ darkMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/', description: 'Overview & Analytics' },
    { id: 'projects', label: 'Projects', icon: MapPin, path: '/projects', description: 'Manage Projects' },
    { id: 'create', label: 'Create', icon: Upload, path: '/create', description: 'New Project' },
    { id: 'marketplace', label: 'Market', icon: Award, path: '/marketplace', description: 'Trade Credits' },
    { id: 'token', label: 'Token', icon: Coins, path: '/token', description: 'Token Info' },
  ]

  return (
    <nav className="navigation">
      <div className="nav-bg">
        <div className="nav-gradient"></div>
        <div className="nav-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`nav-particle nav-particle-${i + 1}`}></div>
          ))}
        </div>
      </div>
      
      <div className="nav-container">
        <div className="nav-items">
          {navItems.map(({ id, label, icon: Icon, path, description }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `nav-item hover-3d ${isActive ? 'active' : ''}`
              }
              data-tilt
            >
              <div className="nav-item-content">
                <div className="nav-icon-container">
                  <Icon className="nav-icon" />
                  <div className="nav-icon-bg"></div>
                </div>
                <div className="nav-text">
                  <span className="nav-label">{label}</span>
                  <span className="nav-description">{description}</span>
                </div>
                <div className="nav-indicator"></div>
              </div>
              
              {/* Active indicator */}
              <div className="active-indicator">
                <div className="active-dot"></div>
                <div className="active-line"></div>
              </div>
              
              {/* Hover effect */}
              <div className="nav-hover-effect"></div>
            </NavLink>
          ))}
        </div>
        
        {/* Navigation glow effect */}
        <div className="nav-glow"></div>
      </div>
    </nav>
  )
}

export default Navigation