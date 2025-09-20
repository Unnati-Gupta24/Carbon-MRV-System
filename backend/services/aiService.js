const fs = require('fs')
const path = require('path')

exports.callAIModel = async (imagePath, projectData) => {
  const confidence = Math.random() * 0.5 + 0.5 // 0.5–1.0
  const carbonCredits = Math.floor(Math.random() * 1000) + 100

  return {
    confidence: parseFloat(confidence.toFixed(2)),
    carbonCredits,
    vegetationCoverage: Math.floor(Math.random() * 100),
    biodiversityIndex: Math.floor(Math.random() * 10),
    analyzedAt: new Date().toISOString(),
    project: projectData,
    notes: 'Simulated AI analysis',
  }
}

exports.storeAIResults = (aiResults) => {
  const resultsDir = path.join(__dirname, '..', 'ai_results')
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir)

  const hash = Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  const filename = `${hash}.json`
  const filepath = path.join(resultsDir, filename)

  fs.writeFileSync(filepath, JSON.stringify(aiResults, null, 2))
  return hash
}
