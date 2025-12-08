FROM rust:1.91-alpine AS builder

ARG TARGETARCH
WORKDIR /usr/src/app

RUN apk add musl-dev pkgconfig

COPY Cargo.toml Cargo.lock ./
COPY . ./

RUN rustup target add aarch64-unknown-linux-musl
RUN rustup target add x86_64-unknown-linux-musl

RUN case "$TARGETARCH" in \
    "arm64")  cargo build --release --target aarch64-unknown-linux-musl ;; \
    "amd64")  cargo build --release --target x86_64-unknown-linux-musl ;; \
    esac

RUN case "$TARGETARCH" in \
    "arm64")  cp /usr/src/app/target/aarch64-unknown-linux-musl/release/mqtt_publisher /usr/src/app/target/release/mqtt_publisher ;; \
    "amd64")  cp /usr/src/app/target/x86_64-unknown-linux-musl/release/mqtt_publisher /usr/src/app/target/release/mqtt_publisher ;; \
    esac

FROM alpine:latest

COPY --from=builder /usr/src/app/target/release/mqtt_publisher /mqtt_publisher

ENTRYPOINT [ "/mqtt_publisher" ]
