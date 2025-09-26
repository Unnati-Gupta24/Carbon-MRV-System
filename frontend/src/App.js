import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import Notification from './components/Notification'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Token from './components/Token'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import AuthModal from './components/AuthModal'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import Marketplace from './pages/MarketPlace'

import './App.css'

const BACKEND_URL = 'http://localhost:3001'

const App = () => {
  const [account, setAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [balance, setBalance] = useState('0')
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({})
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    area: '',
    ecosystemType: 'mangrove',
  })
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [aiResults, setAiResults] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Simplified Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  // Check if user is already authenticated
  useEffect(() => {
    const savedAuth = localStorage.getItem('userAuthenticated')
    const savedEmail = localStorage.getItem('userEmail')
    const authExpiry = localStorage.getItem('authExpiry')
    
    if (savedAuth && savedEmail && authExpiry) {
      const expiryTime = parseInt(authExpiry)
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true)
        setUserEmail(savedEmail)
        setShowAuthModal(false)
      } else {
        // Clear expired auth
        localStorage.removeItem('userAuthenticated')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('authExpiry')
      }
    }
  }, [])

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    setUserEmail('guptaunnati031@gmail.com')
    
    // Save auth state (expires in 24 hours)
    const authExpiry = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem('userAuthenticated', 'true')
    localStorage.setItem('userEmail', 'guptaunnati031@gmail.com')
    localStorage.setItem('authExpiry', authExpiry.toString())
    
    showNotification('Successfully logged in!', 'success')
  }

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowAuthModal(true)
    setUserEmail('')
    
    // Clear auth data
    localStorage.removeItem('userAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('authExpiry')
    
    // Also disconnect wallet
    setAccount('')
    setIsConnected(false)
    setIsVerified(false)
    setBalance('0')
    
    showNotification('Logged out successfully', 'info')
  }

  // Theme toggle function
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
  }

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // === Wallet connect logic ===
  const connectWallet = async () => {
    if (!isAuthenticated) {
      showNotification('Please login first to connect wallet', 'error')
      return
    }

    try {
      setLoading(true)
      if (!window.ethereum) throw new Error('MetaMask not found')

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const account = accounts[0]
      setAccount(account)
      setIsConnected(true)

      try {
        const balance = await provider.getBalance(account)
        setBalance(ethers.formatEther(balance))
      } catch (balanceErr) {
        console.error('Error fetching balance:', balanceErr)
        setBalance('0')
      }

      // verify user
      try {
        const res = await fetch(`${BACKEND_URL}/verify/${account}`)
        const data = await res.json()
        if (data.verified) {
          setIsVerified(true)
        }
      } catch (verifyErr) {
        console.error('Error verifying user:', verifyErr)
        // Don't show an error notification for verification failure
      }

      showNotification('Wallet connected successfully', 'success')
    } catch (err) {
      console.error('Wallet connection error:', err)
      setIsConnected(false)
      setAccount('')
      setBalance('0')
      setIsVerified(false)

      // Show specific error messages
      if (!window.ethereum) {
        showNotification('Please install MetaMask to connect wallet', 'error')
      } else if (err.code === 4001) {
        showNotification('You rejected the connection request', 'error')
      } else {
        showNotification(err.message || 'Failed to connect wallet', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchProjects = useCallback(async () => {
    try {
      if (!account) return
      const res = await fetch(`${BACKEND_URL}/api/projects/user/${account}`)
      const data = await res.json()
      if (res.ok) {
        setProjects(data.projects || [])
      } else {
        console.error('Failed to fetch projects:', data.error)
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }, [account])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      fetchProjects()
    }
  }, [isConnected, account, fetchProjects, isAuthenticated])

  const submitProject = async () => {
    if (!isAuthenticated) {
      showNotification('Please login first', 'error')
      return
    }

    if (!isConnected) {
      showNotification('Please connect wallet first', 'error')
      return
    }

    if (
      !newProject.name ||
      !newProject.location ||
      !newProject.area ||
      !selectedFile
    ) {
      showNotification('Please fill all fields and select an image', 'error')
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
      formData.append('userEmail', userEmail)

      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAiResults(data.aiResults)
        showNotification(
          `Project created successfully! ${
            data.carbonCredits > 0
              ? `Earned ${data.carbonCredits} carbon credits! 🌱`
              : 'AI analysis complete.'
          }`,
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

        // Refresh data
        await fetchProjects()
        await fetchStats()
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Submit failed:', err)
      showNotification('Failed to create project. Please try again.', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  const headerProps = {
    account,
    balance,
    isConnected,
    isVerified,
    connectWallet,
    loading,
    darkMode,
    isAuthenticated,
    userEmail,
    onLogout: handleLogout,
  }

  // Don't render main content if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        <div className="bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
        
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <AuthModal
          show={showAuthModal}
          darkMode={darkMode}
          onLoginSuccess={handleLoginSuccess}
        />
        
        <Notification notification={notification} darkMode={darkMode} />
      </div>
    )
  }

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        {/* Animated background elements */}
        <div className="bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="floating-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Header */}
        <Header {...headerProps} />
        
        {/* Navigation */}
        <Navigation darkMode={darkMode} />

        {/* Main Content */}
        <main className="main-content">
          <div className="content-container">
            {/* Hero Section with 3D Cards */}
            <div className="hero-section">
              <div className="hero-stats">
                <div className="stat-card hover-3d" data-tilt>
                  <div className="stat-icon">🌱</div>
                  <div className="stat-info">
                    <h3>Total Projects</h3>
                    <p>{stats.totalProjects || 0}</p>
                  </div>
                </div>
                <div className="stat-card hover-3d" data-tilt>
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Credits Earned</h3>
                    <p>{stats.totalCredits || 0}</p>
                  </div>
                </div>
                <div className="stat-card hover-3d" data-tilt>
                  <div className="stat-icon">🔗</div>
                  <div className="stat-info">
                    <h3>Verified Users</h3>
                    <p>{stats.verifiedUsers || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Routes */}
            <Routes>
              <Route
                path="/"
                element={<Dashboard stats={stats} projects={projects} darkMode={darkMode} />}
              />
              <Route
                path="/projects"
                element={<Projects projects={projects} darkMode={darkMode} />}
              />
              <Route
                path="/create"
                element={
                  <CreateProject
                    newProject={newProject}
                    setNewProject={setNewProject}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    aiResults={aiResults}
                    submitProject={submitProject}
                    isConnected={isConnected}
                    submitLoading={submitLoading}
                    darkMode={darkMode}
                  />
                }
              />
              <Route path="/marketplace" element={<Marketplace darkMode={darkMode} />} />
              <Route path="/token" element={<Token darkMode={darkMode} />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <Footer darkMode={darkMode} />

        {/* Notification */}
        <Notification notification={notification} darkMode={darkMode} />
      </div>
    </Router>
  )
}

export default App