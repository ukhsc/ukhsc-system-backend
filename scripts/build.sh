#!/bin/sh

# Check if Sentry token exists and is not empty
if [ -f "/sentry_token" ] && [ -s "/sentry_token" ]; then
    echo "Sentry token found, executing full build with Sentry..."
    export SENTRY_AUTH_TOKEN=$(cat /sentry_token)

    VERSION=$(pnpm sentry-cli releases propose-version)
    SENTRY_ORG=tcabbage
    SENTRY_PROJECT=ukhsc-backend

    pnpm sentry-cli releases new $VERSION
    pnpm sentry-cli releases set-commits "$VERSION" --auto

    pnpm build

    pnpm sentry-cli sourcemaps inject ./dist
    pnpm sentry-cli sourcemaps upload ./dist
    pnpm sentry-cli releases finalize $VERSION
    pnpm sentry-cli releases deploys new --release $VERSION -e production

    unset SENTRY_AUTH_TOKEN
else
    echo "Sentry token not found or empty, executing build without Sentry..."
    pnpm build
fi
