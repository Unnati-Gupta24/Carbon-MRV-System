import { Upload, Camera } from 'lucide-react'
import AIResults from './AIResults'

const ProjectForm = ({
  newProject, setNewProject,
  selectedFile, setSelectedFile,
  imagePreview, setImagePreview,
  aiResults,
  submitProject, isConnected, submitLoading
}) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Project Name</label>
        <input
          type="text"
          className="cyber-input w-full"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Location</label>
        <input
          type="text"
          className="cyber-input w-full"
          value={newProject.location}
          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Area (Hectares)</label>
        <input
          type="number"
          className="cyber-input w-full"
          value={newProject.area}
          onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Ecosystem Type</label>
        <select
          className="cyber-input w-full"
          value={newProject.ecosystemType}
          onChange={(e) => setNewProject({ ...newProject, ecosystemType: e.target.value })}
        >
          <option value="mangrove">Mangrove</option>
          <option value="seagrass">Seagrass</option>
          <option value="saltmarsh">Salt Marsh</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Project Image</label>
        <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setImagePreview(null) }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >×</button>
            </div>
          ) : (
            <div className="text-white text-center py-8">
              <Camera className="mx-auto h-12 w-12 text-cyan-300 mb-4" />
              <p>Upload satellite image or aerial photo</p>
            </div>
          )}
        </div>
      </div>

      <AIResults aiResults={aiResults} />

      <button
        onClick={submitProject}
        disabled={submitLoading || !isConnected}
        className="cyber-button w-full"
      >
        {submitLoading ? (
          <>
            <div className="loading-spinner"></div>
            <span className="text-white">Creating Project...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2 text-white" />
            <span className="text-white">Create Project & Analyze</span>
          </>
        )}
      </button>
    </div>
  )
}

export default ProjectForm
