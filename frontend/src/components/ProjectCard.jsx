import { MapPin } from 'lucide-react'

const ProjectCard = ({ project, variant }) => {
  if (variant === 'dashboard') {
    return (
      <div className="project-card">
        <div className="text-white">
          <h4 className="font-semibold mb-2">{project.name}</h4>
          <p className="text-sm text-cyan-300 mb-2">📍 {project.location}</p>
          <p className="text-sm text-cyan-300 mb-4">📏 {project.area} hectares</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded-full">
              {project.ecosystemType}
            </span>
            <span className="text-sm text-green-400 font-semibold">
              {project.carbonCredits} Credits
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-card border-l-4 border-cyan-500">
      <div className="text-white">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-lg">{project.name}</h4>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              project.isActive
                ? 'bg-green-900/50 text-green-300'
                : 'bg-gray-900/50 text-gray-300'
            }`}
          >
            {project.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-sm text-cyan-300 mb-2">📍 {project.location}</p>
        <p className="text-sm text-cyan-300 mb-2">
          📏 {project.area} hectares | 🌿 {project.ecosystemType}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg text-green-400 font-bold">
            {project.carbonCredits} Carbon Credits
          </span>
          <span className="text-xs text-cyan-300">
            Created: {new Date(parseInt(project.createdAt) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
