FROM alpine:3.20.2 AS builder

RUN apk add --no-cache ca-certificates

RUN set -eux; \
  mkdir -p \
    /work/config/caddy \
    /work/data/caddy/locks \
    /work/etc/caddy \
    /work/usr/bin \
    /work/usr/share/caddy \
    /work/usr/local/share/sbom

# https://github.com/caddyserver/caddy/releases
ARG CADDY_VERSION=v2.11.4

RUN set -eux; \
  apkArch="$(apk --print-arch)"; \
  case "$apkArch" in \
    x86_64)  binArch='amd64'; binChecksum='8220d1f013b6f27510247b2360c9e0ca9f018feebd82515f07635318b34ff9777ccc8fd0b6e6f2486ce3a33fe389fbb7db12d05baa474f4587509fb4f5ebf1c9' bomChecksum='29e64876c50ba1ec663da1288c8e965400f2d8ae3d27d55925eb66ab7719cd8ecaa50cf320bae2087061b31f910a06d3a9bf3f8478a4b73fd9b52ada6434af79' ;; \
    aarch64) binArch='arm64'; binChecksum='d5a7c423853c24a799765e0e8210d5c7c22a8f56ed37a3cae2fb9f58be138853c02b4efd6b59d576e6d8c7c0d30b9c1592deeaa6a536ff69bcca23b8c1ea709c' bomChecksum='2f7e67975a526dddd3558ed05539908b0cefef2e9791bfc6ae52e20b84941dd53c047456b487be576e0a3146f51be63f746493a6c32f1cdc3486739d5d6b4d3b' ;; \
    *) echo >&2 "error: unsupported architecture ($apkArch)"; exit 1 ;;\
  esac; \
  wget -O /tmp/caddy.tar.gz "https://github.com/caddyserver/caddy/releases/download/${CADDY_VERSION}/caddy_${CADDY_VERSION#v}_linux_${binArch}.tar.gz"; \
  echo "$binChecksum /tmp/caddy.tar.gz" | sha512sum -c; \
  wget -O /work/usr/local/share/sbom/caddy_${CADDY_VERSION#v}_linux_${binArch}.sbom "https://github.com/caddyserver/caddy/releases/download/${CADDY_VERSION}/caddy_${CADDY_VERSION#v}_linux_${binArch}.sbom"; \
  echo "$bomChecksum /work/usr/local/share/sbom/caddy_${CADDY_VERSION#v}_linux_${binArch}.sbom" | sha512sum -c; \
  tar x -z -f /tmp/caddy.tar.gz -C /work/usr/bin caddy; \
  chmod +x /work/usr/bin/caddy; \
  /work/usr/bin/caddy version

FROM gcr.io/distroless/static-debian12:nonroot

LABEL org.opencontainers.image.title="European Geo Information" \
      org.opencontainers.image.description="European Geo Information Web Application" \
      org.opencontainers.image.source="https://github.com/holgerstolzenberg/european-geo-information" \
      org.opencontainers.image.licenses="MIT"

# See https://caddyserver.com/docs/conventions#file-locations for details
ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data \
    CADDY_TEMPLATE_ENCLOSED_BEGIN={{ \
    CADDY_TEMPLATE_ENCLOSED_END=}}

COPY --from=builder --chown=nonroot:nonroot /work /
COPY --chown=nonroot:nonroot Caddyfile /etc/caddy/

EXPOSE 8080
EXPOSE 2019

WORKDIR /data/caddy

ARG dist_base="./dist/european-geo-information/browser"
COPY --chown=nonroot:nonroot "${dist_base}" /usr/share/html

# Use nonroot user explicitly (UID 65532)
USER 65532:65532

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
