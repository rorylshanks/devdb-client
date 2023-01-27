#!/bin/bash
docker build . -t docker.devdb.cloud/cli:latest
docker push docker.devdb.cloud/cli:latest