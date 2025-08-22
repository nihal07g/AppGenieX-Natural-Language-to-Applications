import { Router } from 'express'
import { createZipBuffer } from '../utils/zipUtils.js'

const router = Router()

router.post('/package-zip', async (req, res) => {
  const { files } = req.body || {}
  if (!Array.isArray(files)) {
    return res
      .status(400)
      .json({
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid files' },
      })
  }
  try {
    const zip = await createZipBuffer(files)
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename="appgeniex.zip"')
    return res.send(zip)
  } catch (e) {
    return res
      .status(500)
      .json({
        ok: false,
        error: { code: 'ZIP_FAILED', message: e.message || 'Zip failed' },
      })
  }
})

export default router
