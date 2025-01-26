#!/bin/bash

source $(dirname "$0")/environment.sh
source $(dirname "$0")/health_check.sh
source $(dirname "$0")/cleanup.sh

LOG_DIR="/var/log/ukhsc-system-backend"
mkdir -p $LOG_DIR

echo "Deploying $1 to $TARGET_ENV..."
determine_environment

docker stop ukhsc-system-backend-api-$TARGET_ENV || true
docker rm ukhsc-system-backend-api-$TARGET_ENV || true

echo "Pulling latest Docker image..."
docker pull $1

echo "Starting new Docker container..."
docker run -d --restart always --name ukhsc-system-backend-api-$TARGET_ENV \
    -p $TARGET_PORT:8787 \
    -v $LOG_DIR:/app/logs \
    -e DATABASE_URL="$DATABASE_URL" \
    -e DIRECT_DATABASE_URL="$DIRECT_DATABASE_URL" \
    -e JWT_SECRET="$JWT_SECRET" \
    -e GOOGLE_OAUTH_CLIENT_ID="$GOOGLE_OAUTH_CLIENT_ID" \
    -e GOOGLE_OAUTH_CLIENT_SECRET="$GOOGLE_OAUTH_CLIENT_SECRET" \
    -e SENTRY_DSN="$SENTRY_DSN" \
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
