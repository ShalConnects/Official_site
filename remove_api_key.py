#!/usr/bin/env python3
"""
Git filter-repo callback to remove exposed Paddle API key
"""
import re

# The exposed API key
EXPOSED_KEY = "pdl_live_apikey_01kafwq9facpvavmctmnvnnczm_XYtbd4ydxKXKKj3F3Vn6pT_A7F"
REPLACEMENT = "REMOVED_API_KEY"

def callback(blob, metadata):
    """Replace the exposed API key in file contents"""
    if blob.data is None:
        return blob
    
    # Convert bytes to string if needed
    try:
        content = blob.data.decode('utf-8')
    except:
        return blob
    
    # Replace the full key
    if EXPOSED_KEY in content:
        content = content.replace(EXPOSED_KEY, REPLACEMENT)
        blob.data = content.encode('utf-8')
    
    return blob

