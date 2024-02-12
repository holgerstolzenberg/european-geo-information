[![main](https://github.com/holgerstolzenberg/cities-of-europe/actions/workflows/build.yml/badge.svg)](https://github.com/holgerstolzenberg/cities-of-europe/actions/workflows/build.yml)

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
docker run [-it] -p8080:8080 holgerstolzenberg/cities-of-europe
```

## ✅ Open points

- Better SASS structure and cleanup
- Cleanup of .whatever configurations (Prettier, ESLint, etc.)
- Add user interactions for layer control
- Caddy based Docker image
- GitHub CI pipeline (docker build, tag, publish?)
- Make Docker image configurable at runtime
- Make Caddy proxy requests to tile server
- Pin package.json versions
