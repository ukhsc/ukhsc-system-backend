#!/bin/bash
set -e

echo "Running database migrations..."
pnpm prisma migrate deploy

echo "Running database seeding..."
pnpm seed

echo "Starting application..."
exec "$@"
