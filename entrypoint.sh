#!/bin/sh -l

if [[ $1 == *"bash" ]]; then
  /bin/bash
  exit 0;
elif [[ $1 == *"sh" ]]; then
  /bin/sh
  exit 0;
fi

echo "Start DX Scanner Action"
if [[ $1 == "dx-scanner "* || $1 == "dxs "* || $1 == "dxscanner "* ]]; then
  echo $@
  $@
elif [[ $1 == "-"* ]]; then
  echo dx-scanner run $@
  dx-scanner run $@
else
  echo dx-scanner run --ci -r -a $@
  dx-scanner run --ci -r -a $@
fi
