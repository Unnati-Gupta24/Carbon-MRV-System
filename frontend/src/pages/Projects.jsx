import { MapPin } from 'lucide-react'
import { useState } from 'react'

const Projects = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  )

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <h3 className="text-lg font-bold text-white mb-4">All My Projects</h3>
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card border-l-4 border-cyan-500 p-4"
                >
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
                    <p className="text-sm text-cyan-300 mb-2">
                      📍 {project.location}
                    </p>
                    <p className="text-sm text-cyan-300 mb-2">
                      📏 {project.area} hectares | 🌿 {project.ecosystemType}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg text-green-400 font-bold">
                        {project.carbonCredits} Carbon Credits
                      </span>
                      <span className="text-xs text-cyan-300">
                        Created:{' '}
                        {new Date(
                          parseInt(project.createdAt) * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="cyber-button-sm"
                >
                  Previous
                </button>
                <span className="text-cyan-300 flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="cyber-button-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-cyan-300 py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects found. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
