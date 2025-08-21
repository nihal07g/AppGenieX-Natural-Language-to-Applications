import { Router } from 'express'
import { generateFilesFromPrompt } from '../services/gemini.js'
import { analyzeQuality } from '../utils/codeQuality.js'
import { summarizeForML, callMLAnalyze } from '../services/mlClient.js'
import { preparePreview } from '../utils/preview.js'

const router = Router()

router.post('/generate-code', async (req, res) => {
  const { prompt } = req.body || {}
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'Invalid prompt' } })
  }
  try {
  const { files, testResults, qualityReport } = await generateFilesFromPrompt(prompt)
    const preview = preparePreview(files)
    const qualityLocal = analyzeQuality(files)
    const summary = summarizeForML(files)
    const qualityML = await callMLAnalyze(summary).catch(() => null)
  const mergedQuality = {
      maintainability: qualityML?.data?.maintainability ?? qualityLocal.maintainability,
      complexity: qualityML?.data?.complexity ?? qualityLocal.complexity,
      coverage: qualityLocal.coverage,
    }

    return res.json({
      ok: true,
      data: {
    files,
    testResults: testResults || [],
    qualityReport: qualityReport || mergedQuality,
        templateType: preview.templateType,
      },
    })
  } catch (e) {
    return res.status(500).json({ ok: false, error: { code: 'GENERATION_FAILED', message: e.message || 'Generation failed' } })
  }
})

export default router
