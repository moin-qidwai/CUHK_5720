#!/bin/bash

for i in {0..200}
do
  echo "executing client number $i...\n"
  node index.js $i &
done
