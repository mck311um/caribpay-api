# CaribPay API

A Caribbean financial services API built with Express.js, TypeScript, and Prisma.

## Features

- User authentication and authorization
- Multi-currency account management (USD, JMD, TTD, BBD, XCD)
- Real-time Caribbean currency exchange rates
- Secure money transfers with transaction validation
- Complete transaction history with audit logging
- Role-based access control (RBAC)
- Rate limiting for API endpoints

## Technologies

| Component      | Technology                  |
| -------------- | --------------------------- |
| Backend        | Node.js + Express.js        |
| Database       | PostgreSQL + Prisma ORM     |
| Language       | TypeScript                  |
| Authentication | JWT with refresh tokens     |
| API Security   | Helmet, CORS, Rate Limiting |
| Testing        | Jest + Supertest            |
| Documentation  | Markdown (`/docs`),         |
| DevOps         | AWS Elastic Beanstalk       |
| Logging        | winston                     |
| Monitoring     | AWS Cloudwatch              |

## Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL 12+
- npm or yarn
- Git
- AWS Account
- pip3
- AWS CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mck311um/caribpay-api
   cd caribpay-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. [Set up database](docs/databse.md)

5. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Setup

1. Create a new `.env` file at the root of the project.
2. Copy the contents of `.env.example` into `.env`:
3. Make sure .env is listed in your .gitignore so that real secrets are never committed to GitHub.

So your real secrets never get pushed to GitHub.

```bash
cp .env.example .env
```

## Table of Contents

- [Setting UP Database](docs/databse.md)
- [Starting Development Server](docs/development.md)
- [Deploying to Live](docs/live.md)
- [Monitoring & logging](docs/logging.md)
- [API Documentation](docs/api-reference.md)

## About

Created by Mc Kellum Lawrence
