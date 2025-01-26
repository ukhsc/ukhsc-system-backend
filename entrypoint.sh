#!/bin/bash
set -e

LOG_DIR=/app/logs
LOG_FILE=$LOG_DIR/latest.log

mkdir -p $LOG_DIR

set -o pipefail

echo "Running database migrations..."
if ! pnpm prisma migrate deploy 2>&1 | tee -a $LOG_FILE; then
    echo "Database migration failed! Check logs for details." >&2
    tail -n 50 $LOG_FILE >&2
    exit 1
fi

echo "Running database seeding..."
if ! pnpm seed 2>&1 | tee -a $LOG_FILE; then
    echo "Database seeding failed! Check logs for details." >&2
    tail -n 50 $LOG_FILE >&2
    exit 1
fi

echo "Starting application..."
exec "$@" > $LOG_FILE 2>&1
