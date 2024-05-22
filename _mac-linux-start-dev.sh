#!/bin/bash

set -e # Exit with nonzero exit code if anything fails
set -u # Treat unset variables as an error
# set -x # Print commands and their arguments as they are executed

# Start Vite using Electron's Node
echo "Starting Cushy in dev mode..."
ELECTRON_OZONE_PLATFORM_HINT=auto CUSHY_RUN_MODE=dev ./node_modules/.bin/electron -i src/shell
