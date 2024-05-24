#!/usr/bin/env bash
source ../credentials/root.sh
cd ../terraform
terraform init
terraform apply
