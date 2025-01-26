#!/bin/bash
set -e

LOG_DIR=/app/logs
LOG_FILE=$LOG_DIR/latest.log

mkdir -p $LOG_DIR

echo "Running database migrations..."
pnpm prisma migrate deploy

echo "Running database seeding..."
pnpm seed

echo "Starting application..."
exec "$@" > $LOG_FILE 2>&1
