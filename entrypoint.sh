#!/bin/bash
set -e

if [[ $1 == *"bash" ]]; then
  exec "/bin/bash"
  exit 0;
elif [[ $1 == *"sh" ]]; then
  exec "/bin/sh"
  exit 0;
fi

echo "Start DX Scanner Action"
if [[ $1 == "dx-scanner "* || $1 == "dxs "* || $1 == "dxscanner "* ]]; then
  echo $@
  exec "$@"
elif [[ $1 == "-"* ]]; then
  echo dx-scanner run $@
  exec dx-scanner run "$@"
else
  echo dx-scanner run --ci -r -a $@
  exec dx-scanner run --ci -r -a "$@"
fi
