#!/bin/bash
# OxonAI IDE Protocol Handler Launcher
# This script handles oxonai:// links

IDE_DIR="/home/arushgupta/Desktop/OxonAI/IDE"
URL="$1"

# Extract the auth code from the URL if present
if [[ "$URL" =~ oxonai://auth\?code=(.+) ]]; then
    CODE="${BASH_REMATCH[1]}"
    echo "Auth code received: $CODE" >> /tmp/oxonai-protocol.log
fi

# Check if IDE is already running
if pgrep -f "electron.*IDE" > /dev/null; then
    echo "IDE already running, passing URL: $URL" >> /tmp/oxonai-protocol.log
    # IDE is running, just activate it
    # The deep link will be handled by the running instance
else
    echo "Starting IDE with URL: $URL" >> /tmp/oxonai-protocol.log
    # Start the IDE
    cd "$IDE_DIR"
    npm start -- "$URL" &
fi
