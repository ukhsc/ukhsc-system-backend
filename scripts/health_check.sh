#!/bin/bash

check_health() {
    local target_port=$1
    local target_env=$2

    COUNTER=0
    SUCCESS_COUNT=0
    REQUIRED_SUCCESSES=2

    while [ $SUCCESS_COUNT -lt $REQUIRED_SUCCESSES ] && [ $COUNTER -lt 12 ]; do
        if curl --silent --fail http://localhost:$target_port/health; then
            echo "Health check passed ($((SUCCESS_COUNT + 1))/$REQUIRED_SUCCESSES)"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "Health check failed, resetting success count"
            SUCCESS_COUNT=0
        fi
        sleep 5
        COUNTER=$((COUNTER + 1))
    done

    if [ $SUCCESS_COUNT -lt $REQUIRED_SUCCESSES ]; then
        echo "Deployment failed: Service did not pass $REQUIRED_SUCCESSES consecutive health checks within 60 seconds"
        docker stop ukhsc-system-backend-api-$target_env || true
        echo "Fetching logs from the failed container..."
        docker logs ukhsc-system-backend-api-$target_env > deployment_failed_logs.txt
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        mkdir -p deployment_logs
        cp deployment_failed_logs.txt deployment_logs/deployment_failed_logs_$TIMESTAMP.txt
        docker rm ukhsc-system-backend-api-$target_env || true
        return 1
    fi
    return 0
}
