FROM alpine:3.19 as builder

RUN apk add --no-cache ca-certificates

RUN set -eux; \
  mkdir -p \
    /work/config/caddy \
    /work/data/caddy/locks \
    /work/etc/caddy \
    /work/usr/bin \
    /work/usr/share/caddy \
    /usr/local/share/sbom

# https://github.com/caddyserver/caddy/releases
ENV CADDY_VERSION v2.7.6

RUN set -eux; \
  apkArch="$(apk --print-arch)"; \
  case "$apkArch" in \
    x86_64)  binArch='amd64'; binChecksum='b74311ec8263f30f6d36e5c8be151e8bc092b377789a55300d5671238b9043de5bd6db2bcefae32aa1e6fe94c47bbf02982c44a7871e5777b2596fdb20907cbf' bomChecksum='6b5e80febf544ee8683930679a95de42f3408b6c9ba04fa2b9e69521a03c70a1a225480be0a571752e7ace8fe39ab9dd467d460357889f0885df908c3f80aa11' ;; \
    aarch64) binArch='arm64'; binChecksum='62252ade5e8dcec13a66154ee1978d959370be049cce52e7c4edefff14ef70bbb21630e3735092719bc3c31214e89dff99e55970ff0adec8ac0a94c6415b059a' bomChecksum='fe9d6fd428262f0b081769e6b0bfd7b4dba525d24e6b1c27e454748ac29f54c89a86b5520b89c061a6a719470ebef71b372cbddb1f0e1d5ec4d9e6cb33a68acd' ;; \
    *) echo >&2 "error: unsupported architecture ($apkArch)"; exit 1 ;;\
  esac; \
    wget -O /tmp/caddy.tar.gz "https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_${binArch}.tar.gz"; \
  echo "$binChecksum /tmp/caddy.tar.gz" | sha512sum -c; \
    wget -O /usr/local/share/sbom/caddy_2.7.6_linux_${binArch}.sbom "https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_${binArch}.sbom"; \
  echo "$bomChecksum /usr/local/share/sbom/caddy_2.7.6_linux_${binArch}.sbom" | sha512sum -c; \
  tar x -z -f /tmp/caddy.tar.gz -C /work/usr/bin caddy; \
  chmod +x /work/usr/bin/caddy; \
  /work/usr/bin/caddy version

FROM gcr.io/distroless/static-debian12@sha256:39ae7f0201fee13b777a3e4a5a9326a8889269172c8b4f4289d9f19c831f45f4

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

ARG dist_base="./dist/cities-of-europe/browser"
COPY --chown=nonroot:nonroot ${dist_base} /usr/share/html

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
