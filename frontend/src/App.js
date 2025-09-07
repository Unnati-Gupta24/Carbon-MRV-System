import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import Notification from './components/Notification'
import Header from './components/Header'
import Navigation from './components/Navigation'

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

  // === Wallet connect logic ===
  const connectWallet = async () => {
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
    fetchStats()
  }, [])

  useEffect(() => {
    if (isConnected) {
      fetchProjects()
    }
  }, [isConnected, account, fetchProjects])

  const submitProject = async () => {
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

  return (
    <Router>
      <div className="cyber-bg flex flex-col">
        <Header
          account={account}
          balance={balance}
          isConnected={isConnected}
          isVerified={isVerified}
          connectWallet={connectWallet}
          loading={loading}
        />
        <Navigation />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={<Dashboard stats={stats} projects={projects} />}
            />
            <Route
              path="/projects"
              element={<Projects projects={projects} />}
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
                />
              }
            />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </main>
        <Notification notification={notification} />
      </div>
    </Router>
  )
}

export default App
