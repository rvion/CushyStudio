#!/bin/bash

set -e # Exit with nonzero exit code if anything fails
set -u # Treat unset variables as an error
# set -x # Print commands and their arguments as they are executed

# Start Vite using Electron's Node
echo "Starting Vite with Electron's Node..."
CUSHY_RUN_MODE=dist ./node_modules/.bin/electron -i src/shell
