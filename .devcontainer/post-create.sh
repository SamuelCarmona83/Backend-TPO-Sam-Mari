#!/bin/bash
npm install && cp .env.example .env
git config --global --add safe.directory /workspaces/Backend-TPO-Sam-Mari

echo "Done, you're ready to code, with the follwing command: 'npm run start' 🚀"
