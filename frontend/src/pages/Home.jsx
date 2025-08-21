import { useMemo, useState } from 'react'
import PromptBox from '../components/PromptBox'
import FileTree from '../components/FileTree'
import LivePreview from '../components/LivePreview'
import QualityPanel from '../components/QualityPanel'
import { clientApi } from '../lib/clientApi'

export default function Home() {
  const [files, setFiles] = useState([])
  const [quality, setQuality] = useState(null)
  const [testResults, setTestResults] = useState([])
  const [templateType, setTemplateType] = useState('client-only')
  const [step, setStep] = useState('idle')

  async function onGenerate(prompt) {
    setStep('generate')
    const res = await clientApi.generateCode(prompt)
    if (res.ok) {
      const { files: out, qualityReport, templateType: t, testResults: tr } = res.data
      setFiles(out)
      setQuality(qualityReport)
      setTestResults(tr || [])
      setTemplateType(t || 'client-only')
      setStep('preview')
    } else {
      alert(res.error?.message || 'Generation failed')
      setStep('idle')
    }
  }

  const canDownload = useMemo(() => files && files.length > 0, [files])

  async function onDownload() {
    const blob = await clientApi.downloadZip(files)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'appgeniex-project.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">AppGenieX</h1>
          <div className="text-sm text-gray-600">{step === 'generate' ? 'Generating…' : 'Ready'}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PromptBox onGenerate={onGenerate} />
          <LivePreview files={files} templateType={templateType} />
        </div>
        <div className="space-y-6">
          <FileTree files={files} />
          <QualityPanel quality={quality} />
          <div className="card p-4">
            <button
              className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg disabled:opacity-50"
              onClick={onDownload}
              disabled={!canDownload}
            >
              Download ZIP
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
