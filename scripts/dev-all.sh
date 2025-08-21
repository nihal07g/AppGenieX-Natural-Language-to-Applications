#!/usr/bin/env bash
# Optional helper; use npm run dev instead.
set -euo pipefail
npm --prefix backend run dev &
npm --prefix ml-service run dev &
npm --prefix frontend run dev &
wait
