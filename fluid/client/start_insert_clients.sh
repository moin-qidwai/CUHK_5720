#!/bin/bash

for i in {0..2}
do
  echo "executing insertion client number $i...\n"
  node insert.mjs $1 &
done
