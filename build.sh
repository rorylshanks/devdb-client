#!/bin/bash
docker build . -t docker.devdb.cloud/devdb-cli:latest
docker push docker.devdb.cloud/devdb-cli:latest