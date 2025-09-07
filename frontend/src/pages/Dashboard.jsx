import StatsCards from '../components/StatsCards'
import ProjectCard from '../components/ProjectCard'
import { MapPin } from 'lucide-react'

const Dashboard = ({ stats, projects }) => {
  return (
    <div className="space-y-6">
      <StatsCards stats={stats} projects={projects} />

      <div className="cyber-card">
        <h3 className="text-lg font-bold text-white mb-4">My Projects</h3>
        {projects.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="dashboard" />
            ))}
          </div>
        ) : (
          <div className="text-center text-cyan-300 py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
