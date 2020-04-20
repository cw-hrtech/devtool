#!/bin/bash

openssl genrsa -out "shared.key" 2048
openssl req -new -key "shared.key" -out "shared.csr" -subj "/CN=shared/O=shared/C=UK"
openssl x509 -req -days 365 -in "shared.csr" -signkey "shared.key" -out "shared.crt"
