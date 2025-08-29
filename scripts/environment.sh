#!/bin/bash

# Determine current / target environment (snippet first, then health, then fallback)
determine_environment() {
    CURRENT_ENV=""
    snippet_file="/etc/nginx/snippets/ukhsc-active-env.conf"

    # 1. Read active env from snippet if available
    if [ -r "$snippet_file" ]; then
        first_line="$(head -n1 "$snippet_file" 2>/dev/null | tr -d '\r')"
        case "$first_line" in
            *' green;'*) CURRENT_ENV="green" ;;
            *' blue;'*)  CURRENT_ENV="blue" ;;
        esac
    fi

    # 2. Fallback: probe health endpoints if still unknown
    if [ -z "$CURRENT_ENV" ]; then
        for p in 3000 3001; do
            if curl -fsS "http://localhost:$p/health" > /dev/null 2>&1; then
                env_val="$(curl -fsS "http://localhost:$p/health" 2>/dev/null | jq -r '.environment' 2>/dev/null || true)"
                if [ "$env_val" = "green" ] || [ "$env_val" = "blue" ]; then
                    CURRENT_ENV="$env_val"
                    break
                fi
            fi
        done
    fi

    # 3. Final fallback
    if [ -z "$CURRENT_ENV" ]; then
        CURRENT_ENV="unknown"
    fi

    # 4. Decide target / ports
    if [ "$CURRENT_ENV" = "green" ]; then
        TARGET_ENV="blue"
        TARGET_PORT=3001
    elif [ "$CURRENT_ENV" = "blue" ]; then
        TARGET_ENV="green"
        TARGET_PORT=3000
    else
        TARGET_ENV="green"
        TARGET_PORT=3000
    fi

    # 5. Strip any stray CR
    CURRENT_ENV="${CURRENT_ENV%$'\r'}"
    TARGET_ENV="${TARGET_ENV%$'\r'}"

    export CURRENT_ENV TARGET_ENV TARGET_PORT
    echo "Current environment is $CURRENT_ENV. Deploying to $TARGET_ENV (port $TARGET_PORT)."
}
