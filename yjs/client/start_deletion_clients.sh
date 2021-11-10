#!/bin/bash

for i in {0..200}
do
  echo "executing deletion client number $i...\n"
  node delete.js $i &
done
