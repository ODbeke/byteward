#!/usr/bin/env bash
set -e

echo "=== 1. Running ByteWard Direct Unit Tests (54 test cases) ==="
python3 -m pytest tests/direct -v

echo "=== 2. Building Next.js Frontend Dashboard ==="
npm run build

echo "=== 3. Verifying ByteWard Contract Schema ==="
npm run verify:schema

echo "=== ALL BYTEWARD VERIFICATION SUITES PASSED SUCCESSFULLY ==="
