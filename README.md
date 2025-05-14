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

| Component      | Technology                    |
| -------------- | ----------------------------- |
| Backend        | Node.js + Express.js          |
| Database       | PostgreSQL + Prisma ORM       |
| Language       | TypeScript                    |
| Authentication | JWT with refresh tokens       |
| API Security   | Helmet, CORS, rate limiting   |
| Testing        | Jest + Supertest              |
| Documentation  | OpenAPI/Swagger (coming soon) |
| CI/CD          | GitHub Actions                |

## Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL 12+
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mck311um/caribpay-api
   cd caribpay-api
   ```

2. Install dependencies:
   npm install

3. Set up environment variables:
   cp .env.example .env

4. Set up database
   ./migrate.sh

5. Start the development server:
   npm run dev

### Environment Setup

1. Create a new `.env` file at the root of the project.
2. Copy the contents of `.env.example` into `.env`:
3. Make sure .env is listed in your .gitignore so that real secrets are never committed to GitHub.

So your real secrets never get pushed to GitHub.

```bash
cp .env.example .env
```

### Development Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
./migrate.sh

```

### API Documentation

The API follows RESTful principles and uses JSON for requests and responses.
For full API reference, see [docs/api-reference.md](docs/api-reference.md)

## About:

Created by Mc Bellum Lawrence
