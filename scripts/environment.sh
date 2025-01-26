#!/bin/bash

# Check both ports to determine current environment
determine_environment() {
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        CURRENT_ENV=$(curl -s http://localhost:3000/health | jq -r '.environment')
    elif curl -s http://localhost:3001/health > /dev/null 2>&1; then
        CURRENT_ENV=$(curl -s http://localhost:3001/health | jq -r '.environment')
    else
        CURRENT_ENV="unknown"
    fi

    if [ "$CURRENT_ENV" == "green" ]; then
        TARGET_ENV="blue"
        TARGET_PORT=3001
    else
        TARGET_ENV="green"
        TARGET_PORT=3000
    fi

    echo "Current environment is $CURRENT_ENV. Deploying to $TARGET_ENV."
}
