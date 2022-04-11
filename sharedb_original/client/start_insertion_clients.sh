#!/bin/bash

for i in {0..99}
do
  echo "executing insertion client number $i...\n"
  node insert.js $i &
done
