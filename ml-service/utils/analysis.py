def analyze_codebase(summary: dict) -> dict:
    total_size = int(summary.get("totalSize", 0))
    files = summary.get("files", [])
    n_files = max(1, len(files))
    avg_size = total_size / n_files if n_files else 0
    complexity_raw = avg_size / 800.0  # arbitrary scale
    complexity_num = max(1, int(complexity_raw * 10))
    maintainability = int(max(10, min(100, 100 - complexity_raw * 60)))
    coverage = int(max(20, min(95, (len(files) / 20.0) * 100)))
    return {
        "complexity": complexity_num,
        "maintainability": maintainability,
        "coverage": coverage,
    }
