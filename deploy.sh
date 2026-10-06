#!/bin/bash
# Publish index.html to https://elements.atasha.me (Cloudflare Workers static assets).
# First time on a machine: `npx -y wrangler@4 login` (browser approval).
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist && mkdir dist && cp index.html dist/
npx -y wrangler@4 deploy
