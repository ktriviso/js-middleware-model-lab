#!/bin/bash

# curl and grab some dog breeds
curl -sa https://raw.githubusercontent.com/paiv/fci-breeds/master/fci-breeds.csv | cut -d',' -f2,3,5,7 | tail +2 > ../data/breeds.csv

# auto generate some dog data (50)
./makeDogData.js 50 > ../data/dogs.csv

