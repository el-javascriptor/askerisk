#!/bin/bash

cd ~/Documents/Code/askerisk/
source ./src-server/.venv/bin/activate

npm run dev &
cd src-server && python3 api.py &
exit
