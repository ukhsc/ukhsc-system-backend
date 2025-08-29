#!/bin/bash
determine_environment() {
  CURRENT_ENV=unknown
  if curl -fsS http://localhost:3000/health >/dev/null 2>&1; then
    v=$(curl -fsS http://localhost:3000/health | jq -r '.environment' 2>/dev/null || true)
    [ "$v" = "green" ] && CURRENT_ENV=green
  fi
  if [ "$CURRENT_ENV" = "unknown" ] && curl -fsS http://localhost:3001/health >/dev/null 2>&1; then
    v=$(curl -fsS http://localhost:3001/health | jq -r '.environment' 2>/dev/null || true)
    [ "$v" = "blue" ] && CURRENT_ENV=blue
  fi
  if [ "$CURRENT_ENV" = "green" ]; then
    TARGET_ENV=blue
    TARGET_PORT=3001
  else
    TARGET_ENV=green
    TARGET_PORT=3000
  fi
  export CURRENT_ENV TARGET_ENV TARGET_PORT
  echo "Current=$CURRENT_ENV Target=$TARGET_ENV Port=$TARGET_PORT"
}
