import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Leaf, 
  Target, 
  MapPin, 
  TrendingUp, 
  Award, 
  Zap, 
  CheckCircle,
  BarChart3,
  Globe
} from 'lucide-react';
import './AIResults.css';

const AIResults = ({ aiResults }) => {
  const navigate = useNavigate();

  if (!aiResults) return null;

  const handleMintNFT = () => {
    navigate('/token', {
      state: {
        carbonCredits: aiResults.carbonCredits,
        projectDetails: aiResults,
      },
    });
  };

  // Calculate health score color and status
  const getHealthStatus = (health) => {
    if (health >= 90) return { status: 'Excellent', color: 'excellent', icon: CheckCircle };
    if (health >= 75) return { status: 'Very Good', color: 'very-good', icon: TrendingUp };
    if (health >= 60) return { status: 'Good', color: 'good', icon: BarChart3 };
    if (health >= 40) return { status: 'Fair', color: 'fair', icon: Target };
    return { status: 'Poor', color: 'poor', icon: Globe };
  };

  const healthInfo = getHealthStatus(parseFloat(aiResults.vegetationHealth) || 0);
  const HealthIcon = healthInfo.icon;

  return (
    <div className="ai-results-container">
      {/* Background Effects */}
      <div className="results-bg-effects">
        <div className="bg-orb bg-orb-success-1"></div>
        <div className="bg-orb bg-orb-success-2"></div>
      </div>

      {/* Header Section */}
      <div className="results-header">
        <div className="header-content">
          <div className="header-icon">
            <Sparkles className="sparkles-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="header-text">
            <h4 className="results-title">AI Analysis Complete</h4>
            <p className="results-subtitle">Environmental impact assessment results</p>
          </div>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          <span className="status-text">Verified</span>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="results-grid">
        {/* Carbon Credits Card */}
        <div className="result-card credits-card">
          <div className="card-header">
            <div className="metric-icon credits-icon">
              <Leaf className="icon" />
            </div>
            <div className="metric-trend positive">
              <TrendingUp className="trend-icon" />
              <span className="trend-value">+{aiResults.carbonCredits}</span>
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{aiResults.carbonCredits}</div>
            <div className="metric-info">
              <span className="metric-label">Carbon Credits</span>
              <span className="metric-description">CO₂ offset potential</span>
            </div>
          </div>
          <div className="metric-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill credits-fill" 
                style={{ width: `${Math.min((aiResults.carbonCredits / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Vegetation Health Card */}
        <div className={`result-card health-card ${healthInfo.color}`}>
          <div className="card-header">
            <div className="metric-icon health-icon">
              <HealthIcon className="icon" />
            </div>
            <div className="health-status">
              <span className="status-label">{healthInfo.status}</span>
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{aiResults.vegetationHealth}%</div>
            <div className="metric-info">
              <span className="metric-label">Vegetation Health</span>
              <span className="metric-description">Ecosystem vitality</span>
            </div>
          </div>
          <div className="health-ring">
            <svg className="ring-svg" viewBox="0 0 36 36">
              <path
                className="ring-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="ring-fill"
                strokeDasharray={`${aiResults.vegetationHealth || 0}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="result-card confidence-card">
          <div className="card-header">
            <div className="metric-icon confidence-icon">
              <Target className="icon" />
            </div>
            <div className="confidence-badge">
              <span className="confidence-text">AI Verified</span>
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{Math.round(aiResults.confidence * 100)}%</div>
            <div className="metric-info">
              <span className="metric-label">Confidence Level</span>
              <span className="metric-description">Analysis accuracy</span>
            </div>
          </div>
          <div className="confidence-bars">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`confidence-bar ${i < Math.round((aiResults.confidence * 100) / 20) ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Area Detected Card */}
        <div className="result-card area-card">
          <div className="card-header">
            <div className="metric-icon area-icon">
              <MapPin className="icon" />
            </div>
            <div className="area-type">
              <span className="type-text">Hectares</span>
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{aiResults.area_detected?.toFixed(1)}</div>
            <div className="metric-info">
              <span className="metric-label">Detected Area</span>
              <span className="metric-description">Coverage analysis</span>
            </div>
          </div>
          <div className="area-visualization">
            <div className="area-grid">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className={`grid-cell ${i < Math.min(Math.round((aiResults.area_detected || 0) / 2), 9) ? 'covered' : ''}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="impact-summary">
        <div className="summary-header">
          <Award className="summary-icon" />
          <span className="summary-title">Environmental Impact Score</span>
        </div>
        <div className="impact-metrics">
          <div className="impact-item">
            <span className="impact-label">Carbon Offset</span>
            <div className="impact-bar">
              <div 
                className="impact-fill carbon-fill" 
                style={{ width: `${Math.min((aiResults.carbonCredits / 50) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="impact-value">High</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Biodiversity</span>
            <div className="impact-bar">
              <div 
                className="impact-fill bio-fill" 
                style={{ width: `${aiResults.vegetationHealth || 0}%` }}
              ></div>
            </div>
            <span className="impact-value">{healthInfo.status}</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Data Quality</span>
            <div className="impact-bar">
              <div 
                className="impact-fill data-fill" 
                style={{ width: `${Math.round(aiResults.confidence * 100)}%` }}
              ></div>
            </div>
            <span className="impact-value">Verified</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="results-actions">
        <button
          onClick={handleMintNFT}
          className="reward-button"
        >
          <div className="button-content">
            <div className="button-icon">
              <Zap className="zap-icon" />
            </div>
            <div className="button-text">
              <span className="button-title">Earn Crypto Rewards</span>
              <span className="button-subtitle">Convert to NFT & claim tokens</span>
            </div>
          </div>
          <div className="button-glow"></div>
        </button>
      </div>
    </div>
  );
};

export default AIResults;