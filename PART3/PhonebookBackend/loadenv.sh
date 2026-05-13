#!/bin/bash

export $(cat .env | xargs)

echo "Environment variables loaded"

echo $MONGODB_URI
