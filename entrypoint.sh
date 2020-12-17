#!/bin/bash
set -e

echo "1"
echo $1
echo "at"
echo $@
echo "wrksp"
echo $GITHUB_WORKSPACE

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
