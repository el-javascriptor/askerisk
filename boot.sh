#!/bin/bash

cd ~/Documents/Code/askerisk/
source ./src-server/.venv/bin/activate

export ASKERISK_PRODUCTION=1

npx electron -r ts-node/register . --no-sandbox &
cd src-server && python3 api.py &
exit
