#!/usr/bin/env bash
source ../credentials/iam.sh
aws sts assume-role \
  --role-arn arn:aws:iam::211125513326:role/foglalo_publish_role \
  --role-session-name foglalo_publish_role \
  --duration-seconds 900
