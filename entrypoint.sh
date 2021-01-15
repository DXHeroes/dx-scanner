#!/bin/sh
set -e

if [ "$#" -eq 0 ] || [ "${1#-}" != "$1" ]; then
  echo dx-scanner run --ci -r $@
  set -- dx-scanner run --ci -r "$@"
fi

echo "Run DX Scanner"

if [[ $1 != "${1#dx-scanner}" || $1 != "${1#dxs}" || $1 != "${1#dxscanner}" ]]; then
  echo  $@
  exec "$@"
fi

  echo $@
  exec "$@"
