#!/bin/sh -l

echo "Start DX Scanner Action"

dx-scanner run --ci -r -a $1
