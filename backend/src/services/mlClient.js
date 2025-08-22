import fetch from 'node-fetch'

export function summarizeForML(files) {
  const top = files
    .slice(0, 20)
    .map((f) => ({ path: f.path, size: (f.content || '').length }))
  const totalSize = files.reduce((a, f) => a + (f.content || '').length, 0)
  return { files: top, totalSize }
}

export async function callMLAnalyze(summary) {
  const base = process.env.ML_SERVICE_URL || 'http://localhost:5001'
  const res = await fetch(`${base}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codebaseSummary: summary }),
    timeout: 7000,
  })
  if (!res.ok) throw new Error(`ML analyze failed: ${res.status}`)
  const data = await res.json()
  return data
}
