#!/bin/bash

# CaribPay Database Migration Script
# Usage: ./migrate.sh
timestamp=$(date +%Y%m%d%H%M%S)
npx prisma migrate dev --name "$timestamp" && npx prisma generate