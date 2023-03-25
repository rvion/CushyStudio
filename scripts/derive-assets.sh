#!/bin/bash

# Set the source image filename
src_file="public/CushyLogo.png"

# Set the output image filenames and sizes
output_files=(
  "src-tauri/icons/128x128.png 128x128"
  "src-tauri/icons/128x128@2x.png 256x256"
  "src-tauri/icons/32x32.png 32x32"
  "src-tauri/icons/Square107x107Logo.png 107x107"
  "src-tauri/icons/Square142x142Logo.png 142x142"
  "src-tauri/icons/Square150x150Logo.png 150x150"
  "src-tauri/icons/Square284x284Logo.png 284x284"
  "src-tauri/icons/Square30x30Logo.png 30x30"
  "src-tauri/icons/Square310x310Logo.png 310x310"
  "src-tauri/icons/Square44x44Logo.png 44x44"
  "src-tauri/icons/Square71x71Logo.png 71x71"
  "src-tauri/icons/Square89x89Logo.png 89x89"
  "src-tauri/icons/StoreLogo.png 50x50"
  "src-tauri/icons/icon.icns 1024x1024"
  "src-tauri/icons/icon.ico 256x256"
  "src-tauri/icons/icon.png 512x512"
)

# Loop through each output file and resize the source image
for output in "${output_files[@]}"
do
  # Split the output filename and size into separate variables
  output_file=$(echo $output | cut -d ' ' -f 1)
  output_size=$(echo $output | cut -d ' ' -f 2)

  # Resize the source image and save the output image
  convert "$src_file" -resize "$output_size" "$output_file"
done


# 128x128.png
# 128x128@2x.png
# 32x32.png
# Square107x107Logo.png
# Square142x142Logo.png
# Square150x150Logo.png
# Square284x284Logo.png
# Square30x30Logo.png
# Square310x310Logo.png
# Square44x44Logo.png
# Square71x71Logo.png
# Square89x89Logo.png
# StoreLogo.png
# icon.icns
# icon.ico
# icon.png