FROM rust:1.91-alpine AS builder

WORKDIR /usr/src/app

COPY Cargo.toml Cargo.lock ./
COPY . ./

RUN cargo build --release

FROM alpine:latest

COPY --from=builder /usr/src/app/target/release/mqtt_publisher /mqtt_publisher

ENTRYPOINT [ "/mqtt_publisher" ]
