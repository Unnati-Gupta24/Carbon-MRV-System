import React from 'react';
import StatsCards from '../components/StatsCards';
import ProjectCard from '../components/ProjectCard';
import { MapPin, Plus, TrendingUp, Calendar, Users, Star, Activity, Zap } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ stats, projects = [] }) => {
  // Sample projects to show when no real projects exist
  const sampleProjects = [
    {
      id: 'sample-1',
      name: 'Urban Smart City Hub',
      description: 'Revolutionary smart city infrastructure project integrating IoT sensors, AI traffic management, and sustainable energy systems.',
      location: 'San Francisco, CA',
      category: 'Smart Cities',
      status: 'In Progress',
      progress: 78,
      budget: '$2.4M',
      team: 12,
      deadline: '2024-06-15',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=250&fit=crop',
      tags: ['IoT', 'AI', 'Sustainability'],
      priority: 'high',
      completedTasks: 23,
      totalTasks: 31
    },
    {
      id: 'sample-2',
      name: 'Green Energy Storage',
      description: 'Next-generation battery technology for renewable energy storage with advanced grid integration capabilities.',
      location: 'Austin, TX',
      category: 'Clean Energy',
      status: 'Planning',
      progress: 25,
      budget: '$1.8M',
      team: 8,
      deadline: '2024-08-20',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
      tags: ['Battery Tech', 'Grid', 'Renewable'],
      priority: 'medium',
      completedTasks: 5,
      totalTasks: 18
    },
    {
      id: 'sample-3',
      name: 'Healthcare AI Platform',
      description: 'Advanced machine learning platform for predictive healthcare analytics and patient outcome optimization.',
      location: 'Boston, MA',
      category: 'Healthcare Tech',
      status: 'Completed',
      progress: 100,
      budget: '$3.2M',
      team: 15,
      deadline: '2024-03-30',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      tags: ['AI', 'Healthcare', 'Analytics'],
      priority: 'high',
      completedTasks: 42,
      totalTasks: 42
    },
    {
      id: 'sample-4',
      name: 'Quantum Computing Lab',
      description: 'Cutting-edge quantum computing research facility with advanced cryogenic systems and quantum processors.',
      location: 'Cambridge, MA',
      category: 'Research',
      status: 'In Progress',
      progress: 60,
      budget: '$5.1M',
      team: 20,
      deadline: '2024-12-15',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
      tags: ['Quantum', 'Computing', 'Research'],
      priority: 'high',
      completedTasks: 18,
      totalTasks: 30
    }
  ];

  // Use real projects if available, otherwise show samples
  const displayProjects = projects.length > 0 ? projects : sampleProjects;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'Planning': return 'status-planning';
      default: return 'status-default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Background Effects */}
      <div className="dashboard-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">
              <span className="welcome-greeting">Welcome back,</span>
              <span className="welcome-name">Project Manager</span>
            </h1>
            <p className="welcome-subtitle">
              Here's what's happening with your projects today
            </p>
          </div>
          <div className="welcome-actions">
            <button className="action-btn secondary-btn">
              <Activity className="btn-icon" />
              View Reports
            </button>
            <button className="action-btn primary-btn">
              <Plus className="btn-icon" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <StatsCards stats={stats} projects={displayProjects} />
      </div>

      {/* Quick Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon trending-up">
              <TrendingUp className="icon" />
            </div>
            <div className="insight-info">
              <h3 className="insight-title">Performance</h3>
              <p className="insight-value">+24%</p>
            </div>
          </div>
          <p className="insight-description">Project completion rate this month</p>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon team">
              <Users className="icon" />
            </div>
            <div className="insight-info">
              <h3 className="insight-title">Team Activity</h3>
              <p className="insight-value">{displayProjects.reduce((acc, p) => acc + (p.team || 0), 0)}</p>
            </div>
          </div>
          <p className="insight-description">Active team members across projects</p>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon schedule">
              <Calendar className="icon" />
            </div>
            <div className="insight-info">
              <h3 className="insight-title">Deadlines</h3>
              <p className="insight-value">3</p>
            </div>
          </div>
          <p className="insight-description">Upcoming deadlines this week</p>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon energy">
              <Zap className="icon" />
            </div>
            <div className="insight-info">
              <h3 className="insight-title">Energy</h3>
              <p className="insight-value">89%</p>
            </div>
          </div>
          <p className="insight-description">Overall project health score</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-section">
        <div className="section-header">
          <div className="section-title">
            <h2 className="title-text">My Projects</h2>
            <div className="title-indicator">
              <span className="project-count">{displayProjects.length}</span>
              <span className="count-label">Active Projects</span>
            </div>
          </div>
          <div className="section-controls">
            <button className="filter-btn">
              <span>All Projects</span>
            </button>
            <button className="view-toggle-btn">
              <div className="toggle-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
            </button>
          </div>
        </div>

        {displayProjects.length > 0 ? (
          <div className="projects-grid">
            {displayProjects.map((project) => (
              <div key={project.id} className="project-card-wrapper">
                <div className="project-card">
                  {/* Project Image */}
                  <div className="project-image">
                    <img 
                      src={project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'} 
                      alt={project.name}
                      className="project-img"
                    />
                    <div className="project-overlay">
                      <div className="project-badges">
                        <span className={`status-badge ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(project.priority)}`}>
                          {project.priority || 'medium'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-name">{project.name}</h3>
                      <div className="project-rating">
                        <Star className="star-icon" />
                        <span className="rating-value">4.8</span>
                      </div>
                    </div>

                    <p className="project-description">
                      {project.description}
                    </p>

                    {/* Project Tags */}
                    <div className="project-tags">
                      {(project.tags || []).map((tag, index) => (
                        <span key={index} className="project-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Project Stats */}
                    <div className="project-stats">
                      <div className="stat-item">
                        <MapPin className="stat-icon" />
                        <span className="stat-text">{project.location}</span>
                      </div>
                      <div className="stat-item">
                        <Users className="stat-icon" />
                        <span className="stat-text">{project.team || 0} members</span>
                      </div>
                      <div className="stat-item">
                        <Calendar className="stat-icon" />
                        <span className="stat-text">{project.deadline}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="project-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">{project.progress || 0}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="progress-details">
                        <span className="tasks-completed">
                          {project.completedTasks || 0}/{project.totalTasks || 0} tasks
                        </span>
                        <span className="project-budget">
                          {project.budget || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="project-actions">
                    <button className="project-btn secondary">
                      View Details
                    </button>
                    <button className="project-btn primary">
                      Continue Work
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <MapPin className="empty-icon-svg" />
            </div>
            <div className="empty-content">
              <h3 className="empty-title">No projects yet</h3>
              <p className="empty-description">
                Create your first project to get started with your dashboard
              </p>
              <button className="empty-action-btn">
                <Plus className="btn-icon" />
                Create First Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;