#!/bin/bash

source $(dirname "$0")/environment.sh
source $(dirname "$0")/health_check.sh
source $(dirname "$0")/cleanup.sh

LOG_DIR="$HOME/ukhsc-system-backend/logs"
mkdir -p "$LOG_DIR"


echo "Deploying $1 to ${TARGET_ENV:-unknown}..."
determine_environment

# Fallback inference if TARGET_ENV unset/invalid
if [ -z "${TARGET_ENV:-}" ] || { [ "$TARGET_ENV" != "green" ] && [ "$TARGET_ENV" != "blue" ]; }; then
  running_green=$(docker ps --format '{{.Names}}' | grep -c '^ukhsc-system-backend-api-green$' || true)
  running_blue=$(docker ps --format '{{.Names}}' | grep -c '^ukhsc-system-backend-api-blue$' || true)
  if [ "$running_green" -gt 0 ] && [ "$running_blue" -eq 0 ]; then
    TARGET_ENV="blue"
    TARGET_PORT=3001
  elif [ "$running_blue" -gt 0 ] && [ "$running_green" -eq 0 ]; then
    TARGET_ENV="green"
    TARGET_PORT=3000
  else
    TARGET_ENV="green"
    TARGET_PORT=3000
  fi
  echo "[info] inferred TARGET_ENV=$TARGET_ENV (fallback)"
fi

docker stop "ukhsc-system-backend-api-$TARGET_ENV" || true
docker rm "ukhsc-system-backend-api-$TARGET_ENV" || true

echo "Pulling latest Docker image..."
docker pull $1

# Validate required environment variables
required_vars=(
    "DATABASE_URL"
    "DIRECT_DATABASE_URL"
    "JWT_SECRET"
    "ARGON2_SECRET"
    "GOOGLE_OAUTH_CLIENT_ID"
    "GOOGLE_OAUTH_CLIENT_SECRET"
    "SENTRY_DSN"
    "SENTRY_RELEASE"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set" >&2
        exit 1
    fi
done

echo "Starting new Docker container..."
NETWORK_OPT=""
if [ -n "$DOCKER_NETWORK" ]; then

  NETWORK_OPT="--network $DOCKER_NETWORK"
fi
docker run -d --restart always --name "ukhsc-system-backend-api-$TARGET_ENV" \
    -p "$TARGET_PORT:8787" \
    -v "$LOG_DIR:/app/logs" \
    $NETWORK_OPT \
    --env-file <(env | grep -E '^(DATABASE_URL|DIRECT_DATABASE_URL|JWT_SECRET|ARGON2_SECRET|GOOGLE_OAUTH_CLIENT_ID|GOOGLE_OAUTH_CLIENT_SECRET|SENTRY_DSN|SENTRY_RELEASE)=') \
    -e CURRENT_ENVIRONMENT="$TARGET_ENV" \
    -e IS_PRODUCTION=true \
    "$1"

echo "Checking health of new deployment..."
if ! check_health $TARGET_PORT $TARGET_ENV; then
    exit 1
fi

echo "Updating Nginx active environment snippet for $TARGET_ENV..."
ENV_SNIPPET="/etc/nginx/snippets/ukhsc-active-env.conf"
mkdir -p /etc/nginx/snippets

# Validate / normalize TARGET_ENV
case "$TARGET_ENV" in
  green|blue) ;;
  *)
    echo "[warn] invalid TARGET_ENV '$TARGET_ENV', forcing green" >&2
    TARGET_ENV="green"
    ;;
esac
if [ -z "$TARGET_ENV" ]; then
  echo "[error] TARGET_ENV empty; aborting snippet update" >&2
  exit 1
fi

if [ ! -f "$ENV_SNIPPET" ]; then
  echo "Initializing snippet (previous env: $CURRENT_ENV)"
  printf 'set $ukhsc_active_env %s;\n' "$CURRENT_ENV" > "$ENV_SNIPPET"
fi
# Atomic update
TMP_SNIPPET="$(mktemp)"
printf 'set $ukhsc_active_env %s;\n' "$TARGET_ENV" > "$TMP_SNIPPET"
cp -f "$ENV_SNIPPET" "${ENV_SNIPPET}.bak" 2>/dev/null || true
mv "$TMP_SNIPPET" "$ENV_SNIPPET"
if nginx -t >/dev/null 2>&1; then
  systemctl reload nginx
  echo "Nginx reloaded. Active environment -> $TARGET_ENV"
else
  echo "nginx config test failed. Restoring previous snippet." >&2
  if [ -f "${ENV_SNIPPET}.bak" ]; then
    cp -f "${ENV_SNIPPET}.bak" "$ENV_SNIPPET"
  fi
  exit 1
fi

echo "Preserving previous environment container ($CURRENT_ENV) for rollback."

echo "Deployment successful!"

cleanup_docker
