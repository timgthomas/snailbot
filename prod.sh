#!/usr/bin/env bash

docker stack rm snailbot
docker-compose build
docker-compose config | docker stack deploy -c - snailbot
