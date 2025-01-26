#!/bin/sh

# Check if Sentry token exists and is not empty
if [ -f "/sentry_token" ] && [ -s "/sentry_token" ]; then
    echo "Sentry token found, executing full build with Sentry..."
    export SENTRY_AUTH_TOKEN=$(cat /sentry_token)

    VERSION=$(pnpm sentry-cli releases propose-version)
    pnpm sentry-cli releases new -o tcabbage -p ukhsc-backend $VERSION
    pnpm sentry-cli releases set-commits -o tcabbage -p ukhsc-backend "$VERSION" --auto

    pnpm build

    pnpm sentry-cli sourcemaps inject -o tcabbage -p ukhsc-backend ./dist
    pnpm sentry-cli sourcemaps upload -o tcabbage -p ukhsc-backend ./dist
    pnpm sentry-cli releases finalize -o tcabbage -p ukhsc-backend $VERSION
    pnpm sentry-cli releases deploys new -o tcabbage -p ukhsc-backend --release $VERSION -e production

    unset SENTRY_AUTH_TOKEN
else
    echo "Sentry token not found or empty, executing build without Sentry..."
    pnpm build
fi
