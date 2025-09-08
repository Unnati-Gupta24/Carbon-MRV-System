const AIResults = ({ aiResults }) => {
  if (!aiResults) return null

  return (
    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
      <h4 className="text-green-400 font-semibold mb-2">AI Analysis Results</h4>
      <div className="text-sm text-white space-y-1">
        <p>🌱 Carbon Credits: <span className="text-green-400">{aiResults.carbonCredits}</span></p>
        <p>🌿 Vegetation Health: <span className="text-green-400">{aiResults.vegetationHealth}</span></p>
        <p>🎯 Confidence: <span className="text-green-400">{Math.round(aiResults.confidence * 100)}%</span></p>
        <p>📏 Detected Area: <span className="text-green-400">{aiResults.area_detected?.toFixed(1)} hectares</span></p>
      </div>
      <div>
        <button className="mt-4 cyber-button-sm">
          Convert Carbon credits into tokens
        </button>
      </div>
    </div>
  )
}

export default AIResults
