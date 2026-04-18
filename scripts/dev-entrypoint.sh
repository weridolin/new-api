#!/bin/sh
set -e

echo "[dev] Building frontend..."
cd /app/web
bun install
DISABLE_ESLINT_PLUGIN=true VITE_REACT_APP_VERSION=$(cat /app/VERSION) bun run build

echo "[dev] Building backend..."
cd /app
VERSION=$(cat VERSION)
go build \
  -ldflags "-s -w -X 'github.com/QuantumNous/new-api/common.Version=${VERSION}'" \
  -o /new-api .

echo "[dev] Starting..."
cd /data
exec /new-api
