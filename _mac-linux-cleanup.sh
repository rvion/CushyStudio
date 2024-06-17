set -eu
rm -rf node_modules
rm -rf .cushy

OS=$(uname -s | tr '[:upper:]' '[:lower:]')

# Clean up .desktop entry and icon on linux
if [ "$OS" = "linux" ]; then
    rm "$HOME/.local/share/icons/cushystudio-shell.png" & # Run in bg because it's the easiest way to let it fail lmao
    rm "$HOME/.local/share/applications/cushystudio-shell.desktop" &
    echo "Removed icon and .desktop files"
fi