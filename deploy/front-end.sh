#!/bin/bash

gcloud auth print-identity-token

if [ $? -eq 0 ]; then
  echo "Using same credentials"
else
  gcloud auth login
fi

cd ./client

source ./.env.production

yarn build

gsutil cp -r build/* gs://sl-trip-alert