import {
  Upload,
  Camera,
  MapPin,
  Ruler,
  Leaf,
  AlertTriangle,
} from 'lucide-react'
import AIResults from '../components/AIResults'
import './CreateProject.css'

const CreateProject = ({
  newProject,
  setNewProject,
  selectedFile,
  setSelectedFile,
  imagePreview,
  setImagePreview,
  aiResults,
  submitProject,
  isConnected,
  submitLoading,
  darkMode,
}) => {
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Show loading state
    const uploadAreaElement = document.querySelector('.upload-area')
    if (uploadAreaElement) {
      uploadAreaElement.setAttribute('data-loading', 'true')
    }

    // Set initial preview
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Check if file name exists in dataset
    const datasetImages = [
      'amazon.PNG',
      'andaman satellite.PNG',
      'bovilian rainforest.PNG',
      'laut.PNG',
      'north sentinel island.PNG',
    ]

    // Remove loading state
    if (uploadAreaElement) {
      uploadAreaElement.removeAttribute('data-loading')
    }

    if (!datasetImages.includes(file.name)) {
      // Show custom popup for non-satellite images
      const popup = document.createElement('div')
      popup.className = 'analysis-popup'
      popup.innerHTML = `
        <div class="popup-content">
          <div class="popup-icon">❌</div>
          <h3>Invalid Image Type</h3>
          <p>The uploaded image does not appear to be a satellite image. Please upload a valid satellite image for analysis.</p>
          <button class="popup-close">Close</button>
        </div>
      `
      document.body.appendChild(popup)

      // Add click handler to close button
      const closeBtn = popup.querySelector('.popup-close')
      closeBtn.onclick = () => {
        popup.remove()
      }

      // Remove popup after 5 seconds
      setTimeout(() => {
        popup.remove()
      }, 5000)

      // Reset the form
      setSelectedFile(null)
      setImagePreview(null)
      return
    }

    // If image is valid, show success state
    if (uploadAreaElement) {
      uploadAreaElement.setAttribute('data-success', 'true')
      setTimeout(() => uploadAreaElement.removeAttribute('data-success'), 1000)
    }
  }

  const ecosystemOptions = [
    {
      value: 'mangrove',
      label: 'Mangrove Forest',
      icon: '🌿',
      description: 'Tropical coastal wetlands',
    },
    {
      value: 'seagrass',
      label: 'Seagrass Meadow',
      icon: '🌱',
      description: 'Marine flowering plants',
    },
    {
      value: 'saltmarsh',
      label: 'Salt Marsh',
      icon: '🌾',
      description: 'Coastal wetland habitat',
    },
  ]

  return (
    <div className="create-project-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content hover-3d" data-tilt>
          <div className="header-icon-container">
            <div className="header-icon">
              <Upload className="icon" />
              <div className="icon-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
          </div>
          <div className="header-text">
            <h1 className="page-title">Create New Blue Carbon Project</h1>
            <p className="page-subtitle">
              Upload satellite imagery and project details for AI-powered carbon
              credit analysis
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <span className="step-label">Project Details</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <span className="step-label">AI Analysis</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <span className="step-label">Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="create-project-container">
        {/* Connection Warning */}
        {!isConnected && (
          <div className="connection-warning hover-3d" data-tilt>
            <div className="warning-icon">
              <AlertTriangle className="icon" />
              <div className="warning-pulse"></div>
            </div>
            <div className="warning-content">
              <h3 className="warning-title">Wallet Connection Required</h3>
              <p className="warning-message">
                Please connect your wallet to create and manage carbon credit
                projects
              </p>
            </div>
            <div className="warning-decoration"></div>
          </div>
        )}

        {/* Project Form */}
        <div className="project-form-card">
          <div className="form-header">
            <div className="form-section-title">
              <div className="section-icon">
                <Leaf className="icon" />
              </div>
              <h2 className="section-title">Project Information</h2>
              <p className="section-subtitle">
                Provide essential details about your carbon project
              </p>
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
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
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
                    <span className="label-text">
                      Enter Location in coordinates
                    </span>
                  </div>
                  <span className="label-required">*</span>
                </label>
                <div className="input-container hover-3d" data-tilt>
                  <input
                    type="text"
                    className="form-input"
                    value={newProject.location}
                    onChange={(e) =>
                      setNewProject({ ...newProject, location: e.target.value })
                    }
                    placeholder="Latitude, Longitude (e.g. 12.3456, -78.9012)"
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
                    onChange={(e) =>
                      setNewProject({ ...newProject, area: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        ecosystemType: e.target.value,
                      })
                    }
                  >
                    {ecosystemOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                  <div className="select-arrow">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  <div className="input-decoration"></div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="image-upload-section">
              <div className="upload-header">
                <label className="form-label">
                  <div className="label-content">
                    <Camera className="label-icon" />
                    <span className="label-text">Project Image</span>
                  </div>
                  <span className="label-required">*</span>
                  <span className="label-hint">
                    Satellite imagery or aerial photos work best
                  </span>
                </label>
              </div>

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
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="preview-image"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                        }}
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <Camera className="overlay-icon" />
                          <span className="overlay-text">
                            Click to change image
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                        setImagePreview(null)
                      }}
                      className="remove-image-btn hover-3d"
                      data-tilt
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
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
                        Upload satellite image or aerial photo for AI analysis
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
                <div className="btn-glow"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProject
