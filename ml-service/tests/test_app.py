from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app


def test_health():
    c = TestClient(app)
    r = c.get("/health")
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_analyze():
    c = TestClient(app)
    r = c.post(
        "/analyze",
        json={
            "codebaseSummary": {"files": [{"path": "a", "size": 10}], "totalSize": 10}
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert "complexity" in data["data"]
