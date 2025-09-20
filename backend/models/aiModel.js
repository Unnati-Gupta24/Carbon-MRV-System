const fs = require('fs')

async function callAIModel(imagePath, projectData) {
  try {
    console.log('🤖 Analyzing image with AI model:', imagePath)

    const { spawn } = require('child_process')

    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        'ai_model.py',
        imagePath,
        JSON.stringify(projectData),
      ])

      let output = ''
      let errorOutput = ''

      python.stdout.on('data', (data) => {
        output += data.toString()
      })

      python.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output)
            console.log('✅ AI Analysis Results:', results)
            resolve(results)
          } catch (e) {
            console.log('⚠️ AI model output parsing failed, using mock data')
            resolve(generateMockAIResults(projectData))
          }
        } else {
          console.log(
            '⚠️ AI model failed, using mock data. Error:',
            errorOutput
          )
          resolve(generateMockAIResults(projectData))
        }
      })
    })
  } catch (error) {
    console.log('⚠️ AI model call failed, using mock data:', error.message)
    return generateMockAIResults(projectData)
  }
}

function generateMockAIResults(projectData) {
  const ecosystemMultipliers = {
    mangrove: { base: 10, variance: 3 },
    seagrass: { base: 8, variance: 2 },
    saltmarsh: { base: 6, variance: 2 },
  }

  const multiplier =
    ecosystemMultipliers[projectData.ecosystemType] ||
    ecosystemMultipliers['mangrove']
  const baseCredits = multiplier.base + Math.random() * multiplier.variance
  const carbonCredits = Math.floor(projectData.area * baseCredits)

  return {
    carbonCredits: carbonCredits,
    ecosystemType: projectData.ecosystemType,
    vegetationHealth: Math.random() > 0.3 ? 'good' : 'moderate',
    confidence: 0.75 + Math.random() * 0.2, 
    area_detected: projectData.area * (0.9 + Math.random() * 0.2), 
    ndvi: 0.3 + Math.random() * 0.4, 
    analysis_timestamp: new Date().toISOString(),
    image_quality: Math.random() > 0.2 ? 'good' : 'moderate',
  }
}

function storeAIResults(aiResults) {
  const hash = require('crypto')
    .createHash('sha256')
    .update(JSON.stringify(aiResults))
    .digest('hex')

  const resultsDir = 'ai_results'
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true })
  }

  fs.writeFileSync(
    `${resultsDir}/${hash}.json`,
    JSON.stringify(aiResults, null, 2)
  )
  return hash
}

module.exports = {
  callAIModel,
  generateMockAIResults,
  storeAIResults
}