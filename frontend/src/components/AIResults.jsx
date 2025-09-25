import { useNavigate } from 'react-router-dom'

const AIResults = ({ aiResults }) => {
  const navigate = useNavigate()

  if (!aiResults) return null

  const handleMintNFT = () => {
    navigate('/token', {
      state: {
        carbonCredits: aiResults.carbonCredits,
        projectDetails: aiResults,
      },
    })
  }

  return (
    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
      <h4 className="text-green-400 font-semibold mb-2">AI Analysis Results</h4>
      <div className="text-sm text-white space-y-1">
        <p>
          🌱 Carbon Credits:{' '}
          <span className="text-green-400">{aiResults.carbonCredits}</span>
        </p>
        <p>
          🌿 Vegetation Health:{' '}
          <span className="text-green-400">{aiResults.vegetationHealth}</span>
        </p>
        <p>
          🎯 Confidence:{' '}
          <span className="text-green-400">
            {Math.round(aiResults.confidence * 100)}%
          </span>
        </p>
        <p>
          📏 Detected Area:{' '}
          <span className="text-green-400">
            {aiResults.area_detected?.toFixed(1)} hectares
          </span>
        </p>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleMintNFT}
          className="cyber-button-sm bg-purple-900/50 border-purple-500/50 hover:bg-purple-700/50 
          transition-all duration-300 hover:scale-105"
        >
          Earn crypto rewards
        </button>
      </div>
    </div>
  )
}

export default AIResults
