import { Upload, MapPin, Award, TrendingUp } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/' },
    { id: 'projects', label: 'Projects', icon: MapPin, path: '/projects' },
    { id: 'create', label: 'Create', icon: Upload, path: '/create' },
    { id: 'marketplace', label: 'Market', icon: Award, path: '/marketplace' },
  ]

  return (
    <nav className="cyber-nav">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center space-x-4">
          {navItems.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `cyber-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="h-4 w-4 mr-1 text-white" />
              <span className="text-white">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
