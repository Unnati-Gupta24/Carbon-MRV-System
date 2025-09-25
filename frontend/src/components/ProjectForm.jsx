import { Upload, Camera, MapPin, Ruler, Leaf } from 'lucide-react'
import AIResults from './AIResults'
import './ProjectForm.css'

const ProjectForm = ({
  newProject, setNewProject,
  selectedFile, setSelectedFile,
  imagePreview, setImagePreview,
  aiResults,
  submitProject, isConnected, submitLoading,
  darkMode
}) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const ecosystemOptions = [
    { value: 'mangrove', label: 'Mangrove Forest', icon: '🌿', description: 'Tropical coastal wetlands' },
    { value: 'seagrass', label: 'Seagrass Meadow', icon: '🌱', description: 'Marine flowering plants' },
    { value: 'saltmarsh', label: 'Salt Marsh', icon: '🌾', description: 'Coastal wetland habitat' }
  ]

  return (
    <div className="project-form">
      <div className="form-header">
        <div className="form-title-section hover-3d" data-tilt>
          <div className="form-icon">
            <Upload className="icon" />
            <div className="icon-pulse"></div>
          </div>
          <div className="form-title-text">
            <h2 className="form-title">Create New Project</h2>
            <p className="form-subtitle">Upload satellite imagery and project details for AI analysis</p>
          </div>
        </div>
      </div>

      <div className="form-content">
        <div className="form-grid">
          {/* Project Name Field */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-content">
                <MapPin className="label-icon" />
                <span className="label-text">Project Name</span>
              </div>
              <span className="label-required">*</span>
            </label>
            <div className="input-container hover-3d" data-tilt>
              <input
                type="text"
                className="form-input"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Enter a descriptive project name"
              />
              <div className="input-decoration"></div>
            </div>
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-content">
                <MapPin className="label-icon" />
                <span className="label-text">Location</span>
              </div>
              <span className="label-required">*</span>
            </label>
            <div className="input-container hover-3d" data-tilt>
              <input
                type="text"
                className="form-input"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                placeholder="City, Country or GPS coordinates"
              />
              <div className="input-decoration"></div>
            </div>
          </div>

          {/* Area Field */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-content">
                <Ruler className="label-icon" />
                <span className="label-text">Area (Hectares)</span>
              </div>
              <span className="label-required">*</span>
            </label>
            <div className="input-container hover-3d" data-tilt>
              <input
                type="number"
                className="form-input"
                value={newProject.area}
                onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <div className="input-unit">ha</div>
              <div className="input-decoration"></div>
            </div>
          </div>

          {/* Ecosystem Type Field */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-content">
                <Leaf className="label-icon" />
                <span className="label-text">Ecosystem Type</span>
              </div>
              <span className="label-required">*</span>
            </label>
            <div className="select-container hover-3d" data-tilt>
              <select
                className="form-select"
                value={newProject.ecosystemType}
                onChange={(e) => setNewProject({ ...newProject, ecosystemType: e.target.value })}
              >
                {ecosystemOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label} - {option.description}
                  </option>
                ))}
              </select>
              <div className="select-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              <div className="input-decoration"></div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-group image-upload-group">
          <label className="form-label">
            <div className="label-content">
              <Camera className="label-icon" />
              <span className="label-text">Project Image</span>
            </div>
            <span className="label-required">*</span>
            <span className="label-hint">Satellite imagery or aerial photos work best</span>
          </label>
          
          <div 
            className="upload-area hover-3d" 
            onClick={() => document.getElementById('file-input').click()}
            data-tilt
          >
            <input 
              id="file-input" 
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect} 
              className="file-input-hidden" 
            />
            
            {imagePreview ? (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                  <div className="image-overlay">
                    <div className="image-info">
                      <Camera className="overlay-icon" />
                      <span className="overlay-text">Click to change image</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedFile(null); 
                    setImagePreview(null) 
                  }}
                  className="remove-image-btn hover-3d"
                  data-tilt
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon-container">
                  <Camera className="upload-icon" />
                  <div className="upload-icon-glow"></div>
                </div>
                <div className="upload-text">
                  <h3 className="upload-title">Upload Project Image</h3>
                  <p className="upload-description">
                    Upload satellite imagery, aerial photos, or ground-level shots
                  </p>
                  <div className="upload-specs">
                    <span className="spec">JPG, PNG up to 10MB</span>
                    <span className="spec-separator">•</span>
                    <span className="spec">Minimum 800x600px</span>
                  </div>
                </div>
                <div className="upload-cta">
                  <div className="upload-btn-text">Click to browse</div>
                  <div className="upload-drag-text">or drag and drop</div>
                </div>
              </div>
            )}
            
            <div className="upload-decoration"></div>
          </div>
        </div>

        {/* AI Results */}
        <AIResults aiResults={aiResults} darkMode={darkMode} />

        {/* Submit Button */}
        <div className="form-submit">
          <button
            onClick={submitProject}
            disabled={submitLoading || !isConnected}
            className="submit-btn hover-3d"
            data-tilt
          >
            <div className="btn-content">
              {submitLoading ? (
                <>
                  <div className="btn-spinner">
                    <div className="spinner-ring"></div>
                  </div>
                  <span className="btn-text">Creating Project...</span>
                  <div className="progress-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="btn-icon" />
                  <span className="btn-text">Create Project & Analyze</span>
                  <div className="btn-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </>
              )}
            </div>
            <div className="btn-glow"></div>
          </button>
          
          {!isConnected && (
            <div className="connection-warning">
              <div className="warning-icon">⚠️</div>
              <span className="warning-text">Please connect your wallet to create projects</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectForm