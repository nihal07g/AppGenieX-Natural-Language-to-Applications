// Simple health check test for backend
import { strict as assert } from 'assert'

// Test that the module imports work
async function testImports() {
  try {
    const { generateFilesFromPrompt } = await import(
      '../src/services/gemini.js'
    )
    assert(
      typeof generateFilesFromPrompt === 'function',
      'generateFilesFromPrompt should be a function',
    )
    console.log('✅ Import test passed')
  } catch (error) {
    console.error('❌ Import test failed:', error.message)
    process.exit(1)
  }
}

// Test that the service returns fallback data when API key is missing
async function testFallbackGeneration() {
  try {
    const { generateFilesFromPrompt } = await import(
      '../src/services/gemini.js'
    )
    // This should return fallback data since we don't have an API key
    const result = await generateFilesFromPrompt('create a simple todo app')

    assert(result && typeof result === 'object', 'Result should be an object')
    assert(Array.isArray(result.files), 'Result should have files array')
    assert(result.files.length > 0, 'Files array should not be empty')
    assert(
      typeof result.qualityReport === 'object',
      'Result should have qualityReport',
    )

    console.log('✅ Fallback generation test passed')
  } catch (error) {
    console.error('❌ Fallback generation test failed:', error.message)
    process.exit(1)
  }
}

async function runTests() {
  console.log('Running backend tests...')
  await testImports()
  await testFallbackGeneration()
  console.log('✅ All backend tests passed!')
}

runTests().catch((error) => {
  console.error('❌ Test runner failed:', error)
  process.exit(1)
})
