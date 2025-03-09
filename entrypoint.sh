#!/bin/sh

if [[ $DEVDB_DB_TYPE ]]; then
    if [[ $DEVDB_DB_NAME ]]; then
        NAME_FLAG="--name $DEVDB_DB_NAME"
    fi
    if [[ $DEVDB_RECONNECT_TO_DB == "true" ]]; then
        RECONNECT_FLAG="--reconnect"
    fi
    if [[ $DEVDB_DB_USERNAME ]]; then
        USERNAME_FLAG="--username $DEVDB_DB_USERNAME"
    fi
    if [[ $DEVDB_DB_PASSWORD ]]; then
        PASSWORD_FLAG="--password $DEVDB_DB_PASSWORD"
    fi
    if [[ $DEVDB_DB_IMAGE ]]; then
        IMAGE_FLAG="--image $DEVDB_DB_IMAGE"
    fi
    if [[ $DEVDB_LOCAL_PORT ]]; then
        PROXY_PORT_FLAG="--proxyPort $DEVDB_LOCAL_PORT"
    fi
    devdb up -p --type $DEVDB_DB_TYPE $NAME_FLAG $IMAGE_FLAG $PROXY_PORT_FLAG $USERNAME_FLAG $PASSWORD_FLAG $RECONNECT_FLAG
    exit 0
fi

devdb $@