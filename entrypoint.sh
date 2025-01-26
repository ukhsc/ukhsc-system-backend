#!/bin/bash
set -e

LOG_DIR=/app/logs
LOG_FILE=$LOG_DIR/latest.log

mkdir -p $LOG_DIR

set -o pipefail

echo "Running database migrations..."
if ! pnpm prisma migrate deploy; then
    echo "Database migration failed!" >&2
    exit 1
fi

echo "Running database seeding..."
if ! pnpm seed; then
    echo "Database seeding failed!" >&2
    exit 1
fi

echo "Starting application..."
exec "$@" > $LOG_FILE 2>&1
