#!/bin/bash

set -e # Exit with nonzero exit code if anything fails
set -u # Treat unset variables as an error
# set -x # Print commands and their arguments as they are executed

PNPM_VERSION=8.11.0
PNPM_HOME=$(pwd)/.cushy
PNPM_BIN_PATH=$(pwd)/.cushy/pnpm

# Function to install using curl
install_with_curl() {
    echo "Installing pnpm with curl..."
    curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION PNPM_BIN_PATH=$PNPM_BIN_PATH PNPM_HOME=$PNPM_HOME sh -
}

# Function to install using wget
install_with_wget() {
    echo "Installing pnpm with wget..."
    wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION PNPM_BIN_PATH=$PNPM_BIN_PATH PNPM_HOME=$PNPM_HOME sh -
}

install_or_update_pnpm() {
    # Check if curl is available
    if command -v curl > /dev/null 2>&1; then
        install_with_curl
    # Check if wget is available
    elif command -v wget > /dev/null 2>&1; then
        install_with_wget
    # If neither curl nor wget is available, exit with error
    else
        echo "Neither curl nor wget is available. Please install one of these packages and try again."
        exit 1
    fi
}

# Check if pnpm is already installed
if command -v $PNPM_HOME/pnpm > /dev/null 2>&1; then
    INSTALLED_PNPM_VERSION=$($PNPM_BIN_PATH --version)

    if [ "$INSTALLED_PNPM_VERSION" != "$PNPM_VERSION" ]; then
        echo "⏳ Updating pnpm from version $INSTALLED_PNPM_VERSION to $PNPM_VERSION..."
        install_or_update_pnpm
    else
        echo "🟢 pnpm is already installed and up to date."
    fi
else
    echo "⏳ pnpm is not installed, proceeding with installation..."
    install_or_update_pnpm
fi

# Verify pnpm installation
if ! command -v $PNPM_BIN_PATH > /dev/null 2>&1; then
    echo "Failed to install or update pnpm."
    exit 1
fi

# Install dependencies using pnpm
echo "Installing dependencies..."
$PNPM_BIN_PATH install --ignore-scripts

# ensuring binary dependencies are correctly linked across installed
./node_modules/.bin/electron-builder install-app-deps


# Define the path to tsconfig.custom.json
tsconfigPath="./tsconfig.custom.json"

# JSON content to write if the file does not exist
defaultTsconfigJSON='{ "include": ["src", "schema/global.d.ts"], "exclude": [] }'

# Check if the file exists
if [ ! -f "$tsconfigPath" ]; then
    # Write the JSON content to the file without formatting
    echo "$defaultTsconfigJSON" > "$tsconfigPath"
fi

# Build the release folder
./node_modules/.bin/electron -i src/shell/build.js js css

# Done
echo "🟢 cushy-install.sh completed successfully."