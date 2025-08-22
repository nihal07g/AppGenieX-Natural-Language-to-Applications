import { Router } from 'express'
import { patchFilesWithRequest } from '../services/gemini.js'

const router = Router()

router.post('/modify-code', async (req, res) => {
  const { featureRequest, currentCodebase } = req.body || {}
  if (!featureRequest || !Array.isArray(currentCodebase)) {
    return res
      .status(400)
      .json({
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid payload' },
      })
  }
  try {
    const files = await patchFilesWithRequest(featureRequest, currentCodebase)
    return res.json({ ok: true, data: { files } })
  } catch (e) {
    return res
      .status(500)
      .json({
        ok: false,
        error: { code: 'MODIFY_FAILED', message: e.message || 'Modify failed' },
      })
  }
})

export default router
