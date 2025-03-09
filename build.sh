#!/bin/bash
docker build . -t rorylshanks/devdb-cli:latest
docker push rorylshanks/devdb-cli:latest