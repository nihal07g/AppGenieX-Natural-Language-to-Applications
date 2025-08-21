import { GoogleGenerativeAI } from '@google/generative-ai'

function getApiKey() {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    ''
  )
}

function client() {
  const key = getApiKey()
  if (!key) return null
  try {
    return new GoogleGenerativeAI(key)
  } catch (e) {
    return null
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function generateFilesFromPrompt(prompt) {
  const gen = client()
  if (!gen) {
  return { files: fallbackTemplates(prompt), testResults: [], qualityReport: { maintainability: 0.7, complexity: 0.3, coverage: 0.5 } }
  }
  try {
    const model = gen.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { temperature: 0.3 } })
    const system = `You are a code generator. Return JSON only with an array named files: [{path, content}]. Keep files small and runnable. Include a simple client-only React app or a full-stack example if the user requests server features.`
    const user = `Prompt: ${prompt}\nReturn JSON only.`
    const resp = await model.generateContent([{ text: system }, { text: user }])
    const raw = resp.response.text()
  const cleaned = raw.replace(/```(json)?/g, '').replace(/```/g, '').trim()
  const json = safeJsonParse(cleaned)
  const files = Array.isArray(json?.files) ? json.files : []
  if (!files.length) return { files: fallbackTemplates(prompt), testResults: [], qualityReport: { maintainability: 0.7, complexity: 0.3, coverage: 0.5 } }
  return { files: normalizeFiles(files), testResults: json?.testResults || [], qualityReport: json?.qualityReport || { maintainability: 0.7, complexity: 0.3, coverage: 0.5 } }
  } catch (e) {
  return { files: fallbackTemplates(prompt), testResults: [], qualityReport: { maintainability: 0.7, complexity: 0.3, coverage: 0.5 } }
  }
}

export async function patchFilesWithRequest(featureRequest, currentFiles) {
  const gen = client()
  if (!gen) {
    return currentFiles // no-op fallback
  }
  try {
    const model = gen.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { temperature: 0.3 } })
    const system = `You patch a codebase. Input: files [{path, content}], request: string. Return JSON only with files patched fully (same shape as input).`
    const user = JSON.stringify({ request: featureRequest, files: currentFiles })
    const resp = await model.generateContent([{ text: system }, { text: user }])
    const raw = resp.response.text()
    const json = safeJsonParse(raw) || safeJsonParse(raw.replace(/```(json)?/g, '').trim())
    const files = Array.isArray(json?.files) ? json.files : null
    return files ? normalizeFiles(files) : currentFiles
  } catch (e) {
    return currentFiles
  }
}

function normalizeFiles(files) {
  return files.map((f) => ({ path: String(f.path).replace(/^\/+/, ''), content: String(f.content ?? '') }))
}

function fallbackTemplates(prompt) {
  const wantServer = /server|api|backend|database|auth|express/i.test(prompt)
  const wantStreamlit = /streamlit|python app/i.test(prompt)
  if (wantStreamlit) return streamlitTemplate()
  if (wantServer) return fullstackTemplate()
  return reactTemplate()
}

function reactTemplate() {
  return [
    { path: 'index.html', content: `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Generated App</title><script defer src="/main.js"></script><link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.10/dist/tailwind.min.css" rel="stylesheet"></head><body class="bg-gray-50"><div id="root"></div></body></html>` },
    { path: 'main.js', content: `const e=React.createElement;const root=ReactDOM.createRoot(document.getElementById('root'));function App(){const [items,setItems]=React.useState([]);const [text,setText]=React.useState('');return e('div',{className:'max-w-xl mx-auto p-6'},[e('h1',{className:'text-2xl font-bold mb-4'},'Hello from AppGenieX'),e('div',{className:'flex gap-2 mb-4'},[e('input',{className:'border flex-1 p-2 rounded',value:text,onChange:e=>setText(e.target.value),placeholder:'Add todo...'}),e('button',{className:'bg-blue-600 text-white px-3 rounded',onClick:()=>{if(text.trim()) setItems([...items,{id:Date.now(),text}]);setText('')}},'Add')]),e('ul',{className:'space-y-2'},items.map(it=>e('li',{key:it.id,className:'p-2 bg-white rounded border'},it.text)))])}root.render(e(React.StrictMode,null,e(App)))` },
  ]
}

function fullstackTemplate() {
  return [
    { path: 'frontend/index.html', content: `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Full-Stack App</title><script defer src="/main.js"></script><link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.10/dist/tailwind.min.css" rel="stylesheet"></head><body><div id="root"></div></body></html>` },
    { path: 'frontend/main.js', content: `const e=React.createElement;const root=ReactDOM.createRoot(document.getElementById('root'));function App(){const [msg,setMsg]=React.useState('');React.useEffect(()=>{fetch('http://localhost:5000/health').then(r=>r.json()).then(d=>setMsg('Backend: '+(d.data?.status||'ok')))},[]);return e('div',{className:'p-6'},[e('h1',{className:'text-xl font-bold'},'Full-Stack Template'),e('p',null,msg)])}root.render(e(React.StrictMode,null,e(App)))` },
    { path: 'backend/server.js', content: `import express from 'express';const app=express();app.get('/health',(req,res)=>res.json({ok:true,data:{service:'template-backend',status:'healthy'}}));app.listen(5000);` },
  ]
}

function streamlitTemplate() {
  return [
    { path: 'app.py', content: `import streamlit as st\nst.title('Generated Streamlit App')\nst.write('Hello from AppGenieX!')` },
    { path: 'requirements.txt', content: `streamlit==1.37.1` },
  ]
}
