const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

async function json(res) {
  const data = await res.json().catch(() => ({}))
  return { status: res.status, ...data }
}

export const clientApi = {
  async generateCode(prompt) {
    const res = await fetch(`${BASE}/api/generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    return json(res)
  },
  async downloadZip(files) {
    const res = await fetch(`${BASE}/api/package-zip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    })
    const blob = await res.blob()
    return blob
  },
}
