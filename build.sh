#!/bin/bash

#set -ex

# Check if the correct number of arguments are passed
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <workspace> <plugin-dir-name>"
  exit 1
fi

# Assign input arguments to variables
WORKSPACE=$1
PLUGIN_DIR_NAME=$2

# Construct the full path to the plugin directory
PLUGIN_DIR="plugins/$PLUGIN_DIR_NAME"

# Create build directory for the plugin if it doesn't exist
mkdir -p "build/$PLUGIN_DIR_NAME"

# Delete any old builds that may be hanging around
rm -rf $PLUGIN_DIR/dist*

# Run the yarn command for the specified workspace
yarn workspace "$WORKSPACE" export-dynamic

# Navigate to the plugin directory
cd "$PLUGIN_DIR" || exit

# Remove any existing .tgz files
rm -f *.tgz

# cd to the dist directory
cd dist-dynamic || exit

# Pack the npm package
npm pack

# Get the tarball name into TARBALL
TARBALL=$(ls *.tgz)

# Move back to the root directory
cd ../../.. || exit

# Move the generated .tgz file to the build subdirectory named after the plugin
mv "$PLUGIN_DIR/dist-dynamic/$TARBALL" "build/$PLUGIN_DIR_NAME/"

# Calculate the base64-encoded SHA256 checksum for the specific .tgz file generated
SHA_SUM=$(shasum -a 256 "build/$PLUGIN_DIR_NAME/$TARBALL" | awk '{print $1}' | xxd -r -p | base64)

# Output the SHA checksum to the screen
echo "SHA checksum: $SHA_SUM"

# Output the SHA checksum to a file with the same name as the tarball but with '-integrity.txt'
echo "$SHA_SUM" > "build/$PLUGIN_DIR_NAME/${TARBALL%.tgz}-integrity.txt"
