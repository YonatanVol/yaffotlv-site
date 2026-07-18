#!/bin/bash
set -euo pipefail

# SessionStart hook for Claude Code on the web.
# Installs Node dependencies so tests, linters and builds work in a fresh
# remote container. Only runs in the remote environment.

# Skip entirely when not running in Claude Code on the web.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies. `npm install` (not `npm ci`) so repeated runs reuse
# the cached node_modules that the container snapshots after this hook.
npm install --no-audit --no-fund

echo "session-start hook: dependencies installed."
