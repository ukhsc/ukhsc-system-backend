#!/bin/bash

source $(dirname "$0")/environment.sh
source $(dirname "$0")/health_check.sh
source $(dirname "$0")/cleanup.sh

LOG_DIR="/var/log/ukhsc-system-backend"
mkdir -p $LOG_DIR

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
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set" >&2
        exit 1
    fi
done

echo "Starting new Docker container..."
docker run -d --restart always --name ukhsc-system-backend-api-$TARGET_ENV \
    -p $TARGET_PORT:8787 \
    -v $LOG_DIR:/app/logs \
    --env-file <(env | grep -E '^(DATABASE_URL|DIRECT_DATABASE_URL|JWT_SECRET|ARGON2_SECRET|GOOGLE_OAUTH_CLIENT_ID|GOOGLE_OAUTH_CLIENT_SECRET|SENTRY_DSN)=') \
    -e CURRENT_ENVIRONMENT=$TARGET_ENV \
    -e IS_PRODUCTION=true \
    $1

echo "Checking health of new deployment..."
if ! check_health $TARGET_PORT $TARGET_ENV; then
    exit 1
fi

echo "Switching Nginx to $TARGET_ENV..."
sed -i "s/127.0.0.1:[0-9]*/127.0.0.1:$TARGET_PORT/" /etc/nginx/sites-available/default
systemctl reload nginx

echo "Cleaning up previous deployment..."
if [ "$CURRENT_ENV" == "green" ]; then
    docker stop ukhsc-system-backend-api-green || true
    docker rm ukhsc-system-backend-api-green || true
else
    docker stop ukhsc-system-backend-api-blue || true
    docker rm ukhsc-system-backend-api-blue || true
fi

echo "Deployment successful!"

cleanup_docker
