#!/bin/bash

# ✅ Install Python3 and requests if needed
dnf update -y
dnf install -y python3 python3-pip

# Install requests package
pip3 install requests

# ✅ Set correct permissions for integration script
chown root:wazuh /var/ossec/integrations/custom-shuffle.py
chmod 750 /var/ossec/integrations/custom-shuffle.py

# Also set permissions for the custom-shuffle script
chown root:wazuh /var/ossec/integrations/custom-shuffle
chmod 750 /var/ossec/integrations/custom-shuffle

# ✅ Start the original Wazuh init process
exec /init
