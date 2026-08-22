#!/usr/bin/env bash
set -e

echo "=== 1. Running DracoGuard Direct Unit Tests (50 test cases) ==="
python3 -m pytest tests/direct -v

echo "=== 2. Building Next.js Frontend Dashboard ==="
npm run build

echo "=== 3. Verifying DracoGuard Contract Schema ==="
npm run verify:schema

echo "=== ALL DRACOGUARD VERIFICATION SUITES PASSED SUCCESSFULLY ==="
