#!/bin/bash
find ./appRoot -type f -name '*.js' -exec rm -f {} \;
find ./appRoot -type f -name '*.js.map' -exec rm -f {} \;
find ./appRoot -type f -name '*.d.ts' -exec rm -f {} \;
find ./appRoot -type f -name '*.gz*' -exec rm -f {} \;
rm -f ./build.js;
rm -f ./build.js.map;
rm -rf dist/
rm -rf aot/