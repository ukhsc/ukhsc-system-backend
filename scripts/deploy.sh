#!/bin/bash

source $(dirname "$0")/environment.sh
source $(dirname "$0")/health_check.sh
source $(dirname "$0")/cleanup.sh

LOG_DIR="$HOME/ukhsc-system-backend/logs"
mkdir -p "$LOG_DIR"


echo "Deploying $1 to $TARGET_ENV..."
determine_environment

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
if [ ! -f "$ENV_SNIPPET" ]; then
  echo "Initializing snippet (previous env: $CURRENT_ENV)"
  echo "set \$ukhsc_active_env $CURRENT_ENV;" > "$ENV_SNIPPET"
fi
echo "set \$ukhsc_active_env $TARGET_ENV;" > "$ENV_SNIPPET"
if nginx -t >/dev/null 2>&1; then
  systemctl reload nginx
  echo "Nginx reloaded. Active environment -> $TARGET_ENV"
else
  echo "nginx config test failed. Reverting snippet." >&2
  echo "set \$ukhsc_active_env $CURRENT_ENV;" > "$ENV_SNIPPET"
  exit 1
fi

echo "Preserving previous environment container ($CURRENT_ENV) for rollback."

echo "Deployment successful!"

cleanup_docker
