#!/bin/bash

# This isn't really part of the code for this plugin
# it is really just a reminder of how to hash the secrets

# Combine client_id and client_secret with a colon
CREDENTIALS="${WEBRCA_CLIENT_ID}:${WEBRCA_CLIENT_SECRET}"

# Encode the credentials in base64
ENCODED_CREDENTIALS=$(echo -n "$CREDENTIALS" | base64)

# Create the Authorization header
AUTH_HEADER="Authorization: Basic $ENCODED_CREDENTIALS"

# Print the header (you can use this in your curl or any request)
echo "$AUTH_HEADER"
