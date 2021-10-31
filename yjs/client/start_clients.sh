#!/bin/bash

for i in {0..100000000000000}
do
  node index.js $i &
done