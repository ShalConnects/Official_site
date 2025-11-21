#!/usr/bin/env python3
import sys

# Read blob from stdin
blob_data = sys.stdin.buffer.read()

# The exposed API key
EXPOSED_KEY = b"pdl_live_apikey_01kafwq9facpvavmctmnvnnczm_XYtbd4ydxKXKKj3F3Vn6pT_A7F"
REPLACEMENT = b"REMOVED_API_KEY"

# Replace the key
if EXPOSED_KEY in blob_data:
    blob_data = blob_data.replace(EXPOSED_KEY, REPLACEMENT)

# Write back to stdout
sys.stdout.buffer.write(blob_data)

