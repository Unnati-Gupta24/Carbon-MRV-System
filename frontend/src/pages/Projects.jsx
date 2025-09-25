import { MapPin } from 'lucide-react'
import { useState } from 'react'
import './Projects.css'

const Projects = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-card-bg border border-border-color rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-text-primary">
            My Projects Portfolio
          </h3>
          <span className="text-text-secondary">
            Total Projects: {projects.length}
          </span>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-bg-secondary border border-border-color rounded-xl p-5 hover:transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-lg text-text-primary">
                      {project.name}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {project.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-text-secondary">
                      <MapPin className="h-4 w-4 mr-2" />
                      {project.location}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center">
                        <span className="mr-1">📏</span>
                        {project.area} hectares
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🌿</span>
                        {project.ecosystemType}
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border-color">
                      <div className="flex items-center justify-between">
                        <div className="bg-accent/10 px-3 py-2 rounded-lg">
                          <span className="text-accent font-semibold">
                            {project.carbonCredits}
                          </span>
                          <span className="text-text-secondary text-sm ml-1">
                            Credits
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {new Date(
                            parseInt(project.createdAt) * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-border-color bg-bg-secondary text-text-secondary hover:bg-hover-bg disabled:opacity-50 transition-all duration-200"
                >
                  ← Previous
                </button>
                <span className="text-text-secondary px-4 py-2 bg-bg-secondary rounded-lg border border-border-color">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-border-color bg-bg-secondary text-text-secondary hover:bg-hover-bg disabled:opacity-50 transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-text-secondary opacity-40" />
            <p className="text-text-secondary">
              No projects found. Create your first project!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
