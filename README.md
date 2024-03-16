[![build-main-branch](https://github.com/holgerstolzenberg/european-geo-information/actions/workflows/main-branch-build.yml/badge.svg?branch=main)](https://github.com/holgerstolzenberg/european-geo-information/actions/workflows/main-branch-build.yml)
[![Build feature](https://github.com/holgerstolzenberg/european-geo-information/actions/workflows/feature-branch-build.yml/badge.svg)](https://github.com/holgerstolzenberg/european-geo-information/actions/workflows/feature-branch-build.yml)


# European Geo Information

## 🚀 Introduction

This is just a small sample project to get up to date with Angular and learn some [deck.gl](https://deck.gl) stuff.

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
docker run [-it] -p8080:8080 -p2019:2019 holgerstolzenberg/european-geo-information
```

## 📥 Open points

## Features

- ✅️Add user interactions for layer control
- ✅️Expandable toolbar
- ✅️Own location finder
- ✅️Smoother map animation (only mac chrome so far, retina)
- ✅️Add loading indicator
- ✅️Slider for map pitch angle
- ✅️Map initializing indicator
- Cross-hair on own location
- Also reset map pitch
- Weather or other overlays
- Distance to capitols

## Development

- Scoped translation files
- Investigate 404 on app start
- Better SCSS structure and cleanup
- Cleanup of .whatever configurations (Prettier, ESLint, etc.)
- ✅️Logging service abstraction
- ✅️Pin package.json versions
- ✅️Glitching focus frame around map

## Packaging

- Make Docker image configurable at runtime -> let run at specific context (? env.js)
- ✅️Caddy based Docker image
- ✅️Make Caddy proxy requests to tile server

## CI

- GitHub CI pipeline
  - ✅️docker build
  - ✅️publish
  - ✅️GitHub pages
