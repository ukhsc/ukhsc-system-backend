#!/bin/bash

cleanup_docker() {
    echo "Cleaning up old Docker resources..."
    docker system prune -a -f --filter "until=24h"
    docker image prune -a -f --filter "until=24h"
    docker container prune -f --filter "until=24h"
    docker volume prune -f
}
