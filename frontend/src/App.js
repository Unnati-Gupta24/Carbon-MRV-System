import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  Upload,
  MapPin,
  Camera,
  Leaf,
  Award,
  Wallet,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Globe,
} from 'lucide-react'
import './App.css'

const BACKEND_URL = 'http://localhost:3001'

const BlueCarbonApp = () => {
  // State management
  const [account, setAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [balance, setBalance] = useState('0')
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    area: '',
    ecosystemType: 'mangrove',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [aiResults, setAiResults] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true)

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })

        const provider = new ethers.BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()

        // Check if on Amoy testnet (Polygon's current testnet)
        if (network.chainId !== 80002n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x13882' }], // Amoy testnet
            })
          } catch (switchError) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13882',
                    chainName: 'Polygon Amoy Testnet',
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18,
                    },
                    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                  },
                ],
              })
            }
          }
        }

        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)

        setAccount(address)
        setBalance(ethers.formatEther(balance))
        setIsConnected(true)

        // Check if verified organization
        await checkVerificationStatus(address)

        showNotification('Wallet connected successfully! 🎉', 'success')

        // Load user projects
        await loadUserProjects(address)
      } else {
        showNotification('Please install MetaMask!', 'error')
      }
    } catch (error) {
      console.error('Connection failed:', error)
      showNotification(`Failed to connect wallet: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Check verification status
  const checkVerificationStatus = async (address) => {
    try {
      const verifyResponse = await fetch(`${BACKEND_URL}/api/verify/${address}`)
      const verifyData = await verifyResponse.json()
      setIsVerified(verifyData.isVerified)
    } catch (error) {
      console.error('Failed to check verification:', error)
      setIsVerified(false)
    }
  }

  // Load user projects
  const loadUserProjects = async (address) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/user/${address}`)
      const data = await response.json()
      
      if (response.ok) {
        setProjects(data.projects || [])
      } else {
        console.error('Failed to load projects:', data.error)
        if (data.message && data.message.includes('ABI')) {
          showNotification('Blockchain functionality not available', 'info')
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
      showNotification('Unable to load projects', 'error')
    }
  }

  // Load platform statistics
  const loadStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File too large. Maximum size is 10MB.', 'error')
        return
      }

      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error')
        return
      }

      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit project
  const submitProject = async () => {
    if (!selectedFile || !newProject.name || !newProject.location || !newProject.area) {
      showNotification('Please fill all fields and select an image', 'error')
      return
    }

    if (!account) {
      showNotification('Please connect your wallet first', 'error')
      return
    }

    if (isNaN(newProject.area) || parseFloat(newProject.area) <= 0) {
      showNotification('Please enter a valid area in hectares', 'error')
      return
    }

    try {
      setSubmitLoading(true)
      showNotification('Creating project and analyzing image...', 'info')

      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('name', newProject.name)
      formData.append('location', newProject.location)
      formData.append('area', newProject.area)
      formData.append('ecosystemType', newProject.ecosystemType)
      formData.append('userAddress', account)

      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAiResults(data.aiResults)
        showNotification(
          `Project created successfully! ${data.carbonCredits > 0 ? `Earned ${data.carbonCredits} carbon credits! 🌱` : 'AI analysis complete.'}`,
          'success'
        )

        // Reset form
        setNewProject({
          name: '',
          location: '',
          area: '',
          ecosystemType: 'mangrove',
        })
        setSelectedFile(null)
        setImagePreview(null)
        setAiResults(null)

        // Reload data
        if (isConnected) {
          await loadUserProjects(account)
        }
        await loadStats()

        // Switch to dashboard
        setActiveTab('dashboard')
      } else {
        showNotification(`Error: ${data.error || 'Unknown error'}`, 'error')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      showNotification('Failed to create project. Please try again.', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  // Load initial data
  useEffect(() => {
    loadStats()

    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet()
        }
      })
    }
  }, [])

  return (
    <div className="cyberpunk-bg">
      <div className="grid-bg"></div>
      <div className="scan-lines"></div>
      <div className="cyber-container">
        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="flex items-center">
              {notification.type === 'success' && (
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
              )}
              {notification.type === 'error' && (
                <AlertCircle className="h-5 w-5 mr-2 text-white" />
              )}
              {notification.type === 'info' && (
                <AlertCircle className="h-5 w-5 mr-2 text-white" />
              )}
              <span className="text-white">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="cyber-header">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="cyber-logo">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="cyber-title">Blue Carbon Registry</h1>
                  <p className="cyber-subtitle">
                    Blockchain-powered MRV System
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isConnected ? (
                  <div className="cyber-wallet">
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {account.slice(0, 6)}...{account.slice(-4)}
                        </div>
                        <div className="text-xs text-cyan-300">
                          {parseFloat(balance).toFixed(3)} MATIC
                        </div>
                      </div>
                      {isVerified && <div className="verified-badge">✓</div>}
                      <div className="status-indicator"></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="cyber-button"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span className="text-white">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2 text-white" />
                        <span className="text-white">Connect Wallet</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="cyber-nav">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center space-x-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'projects', label: 'Projects', icon: MapPin },
                { id: 'create', label: 'Create', icon: Upload },
                { id: 'marketplace', label: 'Market', icon: Award },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`cyber-nav-item ${
                    activeTab === id ? 'active' : ''
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1 text-white" />
                  <span className="text-white">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: 'Total Projects',
                    value: stats.totalProjects || '0',
                    icon: Globe,
                  },
                  {
                    label: 'Total Credits',
                    value: stats.totalCarbonCredits || '0',
                    icon: Leaf,
                  },
                  { 
                    label: 'My Projects', 
                    value: projects.length || '0', 
                    icon: Users 
                  },
                ].map((stat, index) => (
                  <div key={index} className="stats-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">
                          {stat.label}
                        </p>
                        <p className="stats-number">{stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-cyan-300" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="cyber-card">
                <h3 className="text-lg font-bold text-white mb-4">
                  My Projects
                </h3>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="project-card">
                        <div className="text-white">
                          <h4 className="font-semibold mb-2">{project.name}</h4>
                          <p className="text-sm text-cyan-300 mb-2">
                            📍 {project.location}
                          </p>
                          <p className="text-sm text-cyan-300 mb-4">
                            📏 {project.area} hectares
                          </p>
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
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="cyber-card">
                <h3 className="text-lg font-bold text-white mb-4">
                  All My Projects
                </h3>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="project-card border-l-4 border-cyan-500">
                        <div className="text-white">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{project.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.isActive 
                                ? 'bg-green-900/50 text-green-300' 
                                : 'bg-gray-900/50 text-gray-300'
                            }`}>
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
                              Created: {new Date(parseInt(project.createdAt) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-cyan-300 py-8">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No projects found. Create your first project!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Project Form */}
          {activeTab === 'create' && (
            <div className="cyber-card">
              <h3 className="text-lg font-bold text-white mb-4">
                Create New Blue Carbon Project
              </h3>
              
              {!isConnected && (
                <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Please connect your wallet to create projects
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mangrove Restoration Bay Area"
                    className="cyber-input w-full"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sundarbans, West Bengal, India"
                    className="cyber-input w-full"
                    value={newProject.location}
                    onChange={(e) =>
                      setNewProject({ ...newProject, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Area (Hectares)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 25.5"
                    step="0.1"
                    min="0"
                    className="cyber-input w-full"
                    value={newProject.area}
                    onChange={(e) =>
                      setNewProject({ ...newProject, area: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Ecosystem Type
                  </label>
                  <select
                    className="cyber-input w-full"
                    value={newProject.ecosystemType}
                    onChange={(e) =>
                      setNewProject({ ...newProject, ecosystemType: e.target.value })
                    }
                  >
                    <option value="mangrove">Mangrove</option>
                    <option value="seagrass">Seagrass</option>
                    <option value="saltmarsh">Salt Marsh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Project Image
                  </label>
                  <div
                    className="upload-area"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFile(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-white text-center py-8">
                        <Camera className="mx-auto h-12 w-12 text-cyan-300 mb-4" />
                        <p className="mb-2">Upload satellite image or aerial photo</p>
                        <p className="text-sm text-cyan-300">
                          Supported: JPG, PNG, GIF (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {aiResults && (
                  <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">AI Analysis Results</h4>
                    <div className="text-sm text-white space-y-1">
                      <p>🌱 Carbon Credits: <span className="text-green-400">{aiResults.carbonCredits}</span></p>
                      <p>🌿 Vegetation Health: <span className="text-green-400">{aiResults.vegetationHealth}</span></p>
                      <p>🎯 Confidence: <span className="text-green-400">{Math.round(aiResults.confidence * 100)}%</span></p>
                      <p>📏 Detected Area: <span className="text-green-400">{aiResults.area_detected?.toFixed(1)} hectares</span></p>
                    </div>
                  </div>
                )}

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
            </div>
          )}

          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div className="cyber-card">
              <h3 className="text-lg font-bold text-white mb-4">
                Carbon Credits Marketplace
              </h3>
              <div className="text-center text-white">
                <Award className="h-16 w-16 text-cyan-300 mx-auto mb-4" />
                <p className="text-lg mb-2">Marketplace Coming Soon</p>
                <p className="text-cyan-300 text-sm">
                  Trade verified blue carbon credits with buyers worldwide
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BlueCarbonApp