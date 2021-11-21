#!/bin/bash

for i in {0..200}
do
  echo "executing insertion client number $i...\n"
  node insert.js $i &
done
