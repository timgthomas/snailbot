#!/usr/bin/env bash

docker-compose build
docker-compose config | docker stack deploy -c - snailbot