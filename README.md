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

- [x] Add user interactions for layer control
- [x] Expandable toolbar
- [x] Own location finder
- [x] Smoother map animation (only Mac Chrome so far, retina)
- [x] Add loading indicator
- [x] Slider for map pitch angle
- [x] Map initializing indicator
- [x] Cross-hair on own location
- [ ] Also reset map pitch
- [ ] Weather or other overlays
- [ ] Distance to capitols

## Development

- [ ] Scoped translation files
- [x] Investigate 404 on app start
- [ ] Better SCSS structure and cleanup
- [x] Cleanup of .whatever configurations (Prettier, ESLint, etc.)
- [x] Logging service abstraction
- [x] Pin package.json versions
- [x] Glitching focus frame around map

## Packaging

- [ ] Make Docker image configurable at runtime => let it run at a specific context (? env.js)
- [x] Caddy-based Docker image
- [x] Make Caddy proxy requests to tile server

## CI

- [x] docker build
- [x] publish
- [x] GitHub pages
