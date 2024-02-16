[![build-main-branch](https://github.com/holgerstolzenberg/cities-of-europe/actions/workflows/main-branch-build.yml/badge.svg?branch=main)](https://github.com/holgerstolzenberg/cities-of-europe/actions/workflows/main-branch-build.yml)

# Cities of Europe

## 🚀 Introduction

This is just a small sample project to get up to date with Angular and learn some Leaflet stuff.

## 🫡 Commands

```bash
# build it
ng build [-c dev]

# Run dev server
ng serve [-c dev]

# Lint
ng lint

# Build docker image
./docker-build.sh

# Run docker image locally
docker run [-it] -p8080:8080 -p2019:2019 holgerstolzenberg/cities-of-europe
```

## ✅ Open points

## Features

- Add user interactions for layer control
- Expandable toolbar
- ☑️Own location finder
- Discover Leaflet plugins
- Weather overlays
- Smoother map animation
- Add loading indicator

## Development

- Better SASS structure and cleanup
- Cleanup of .whatever configurations (Prettier, ESLint, etc.)
- ☑️Pin package.json versions
- Glitching white focus frame around map

## Packaging

- Make Docker image configurable at runtime -> let run at specific context
- ☑️Caddy based Docker image
- ☑️Make Caddy proxy requests to tile server

## CI

- GitHub CI pipeline
  - ☑️docker build
  - ☑️publish
  - ☑️GitHub pages
  - tag
