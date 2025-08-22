import { useEffect, useMemo, useRef, useState } from 'react'

const CDN_HTML = ({ js, css, html }) => `<!doctype html>
<html>
<head>
<meta charset='utf-8'/>
<meta name='viewport' content='width=device-width, initial-scale=1'/>
<script src="https://cdn.tailwindcss.com"></script>
${css ? `<style>${css}</style>` : ''}
</head>
<body>
<div id='root'></div>
${html || ''}
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script>
${js}
</script>
</body>
</html>`

function buildClientOnlyBundle(files) {
  const indexHtml =
    files.find((f) => /index\.html$/.test(f.path))?.content || ''
  const js = files
    .filter((f) => f.path.endsWith('.js') || f.path.endsWith('.jsx'))
    .map((f) => `// ${f.path}\n` + f.content)
    .join('\n')
  const css = files
    .filter((f) => f.path.endsWith('.css'))
    .map((f) => f.content)
    .join('\n')
  return { js, css, html: indexHtml }
}

export default function LivePreview({ files, templateType }) {
  const [viewport, setViewport] = useState('desktop')
  const iframeRef = useRef(null)

  const bundle = useMemo(() => buildClientOnlyBundle(files || []), [files])

  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    const html = CDN_HTML(bundle)
    doc.open()
    doc.write(html)
    doc.close()
  }, [bundle])

  if (templateType === 'full-stack') {
    return (
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Preview</h3>
        <p className="text-sm text-gray-600">
          Full-stack projects require running both client and server. Use{' '}
          <code>npm run dev</code> at the repo root and open the app.
        </p>
      </div>
    )
  }

  if (!files?.length) {
    return <div className="card p-4 text-gray-500">Nothing to preview yet.</div>
  }

  const sizes = {
    mobile: 'w-[375px] h-[667px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-[600px]',
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Live Preview</h3>
        <div className="flex gap-2">
          {['mobile', 'tablet', 'desktop'].map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`px-3 py-1 rounded-md border ${viewport === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <iframe
          ref={iframeRef}
          title="preview"
          className={`${sizes[viewport]} border rounded-xl`}
        ></iframe>
      </div>
    </div>
  )
}
