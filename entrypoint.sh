#!/bin/bash
set -e

if [[ $1 == *"bash" ]]; then
  exec "/bin/bash"
elif [[ $1 == *"sh" ]]; then
  exec "/bin/sh"
fi

echo "Run DX Scanner"

if [[ $1 == "dx-scanner"* || $1 == "dxs"* || $1 == "dxscanner"* ]]; then
  echo $@
  exec "$@"
else
  echo dx-scanner run $@ --ci -r
  exec dx-scanner run "$@" --ci -r
fi
