#!/bin/bash
docker build . -t docker.devdb.cloud/cli:latest --no-cache
docker push docker.devdb.cloud/cli:latest