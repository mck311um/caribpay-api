#!/bin/bash

eb init -p node.js caribpay-api --region us-east-1
eb create caribpay-env
eb setenv NODE_ENV=production PORT=3000 JWT_SECRET=... DATABASE_URL=...
eb deploy