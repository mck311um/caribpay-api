# Setting Up Database

## Prerequisites

Before you begin, ensure you have:

- An **AWS Account**
- AWS **IAM permissions** to create RDS instances
- Installed **AWS CLI** (optional, but useful for automation)
- A preferred **PostgreSQL client** (e.g., pgAdmin, DBeaver, CLI)

---

## 1. Create an RDS PostgreSQL Instance

### Sign in to AWS Console

- Navigate to **AWS Console → RDS**.
- Click **Create Database**.

### Select Database Engine

- Choose **PostgreSQL**.
- Select version **compatible** with your application.

### Choose Deployment Type

- Select **Standard Create** for full control.

### Configure Database Settings

- **DB instance identifier**: `caribpay-db`
- **Master username**: `admin`
- **Master password**: _(store securely, do not hardcode)_
- Choose **Instance Class** (`db.t3.micro` for free-tier).

### Storage Options

- Allocate **20GB+ storage** (auto-scaling enabled).
- **Storage type**: `General Purpose (SSD)`

### Configure Connectivity

- Enable **Public Access** (if external access is needed).
- Select **VPC & Security Group**:
  - Allow inbound connections to **PostgreSQL port (5432)**.
  - Whitelist trusted IPs only.

### Enable Backups & Monitoring

- **Automated backups**: Enable.
- **Performance Insights**: Enable (optional).
- **CloudWatch Monitoring**: Enable for logging queries.

### Click "Create Database"

Your **PostgreSQL RDS instance** is now provisioning 🚀.

---

## 2. Connect to the Database

Update your .env file with:

```bash
DATABASE_URL="postgresql://admin:your_password@your_rds_endpoint:5432/caribpay-db"

```

## 3. Migrate Database Schema

```bash
./migrate.sh
```
