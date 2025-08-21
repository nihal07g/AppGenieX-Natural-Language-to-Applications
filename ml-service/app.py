import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.analysis import analyze_codebase

BACKEND_ORIGIN = os.getenv("BACKEND_ORIGIN", "http://localhost:5000")

app = FastAPI(title="AppGenieX ML Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[BACKEND_ORIGIN],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

class AnalyzeReq(BaseModel):
    codebaseSummary: dict

@app.get("/health")
async def health():
    return {"ok": True, "data": {"service": "ml-service", "status": "healthy"}}

@app.post("/analyze")
async def analyze(req: AnalyzeReq):
    metrics = analyze_codebase(req.codebaseSummary)
    return {"ok": True, "data": metrics}
