#!/bin/sh
set -e

if [[ $1 != "${1%bash}" || $1 != "${1%sh}" ]]; then
  exec "$@"
fi

echo "Run DX Scanner"

if [[ $1 != "${1#dx-scanner}" || $1 != "${1#dxs}" || $1 != "${1#dxscanner}" ]]; then
  echo $@
  exec "$@"
else
  echo dx-scanner run --ci -r $@
  exec dx-scanner run --ci -r "$@"
fi
