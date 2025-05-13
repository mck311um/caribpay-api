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

### Environment Variables

Create a `.env` file with these variables:
DATABASE_URL="postgresql://user:password@localhost:5432/caribpay?schema=public"
JWT_SECRET="rT9#Lx3!KpV2$wTmZeR1cY&Hs9AfE0oIbMnQXdG5Jh7BtCvLrU4WyN6^uLgPzMj6@qTkXv#E!7LdRp0Cf3sHaBn$YcUw!AvZxN8Rb%Kj5M^tZrXe6DoLqP#Cv"
PORT=3000
NODE_ENV="development"

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

## Base URL

http://localhost:3000/api/v1

## Authentication

Add your JWT token in the headers:
x-auth-token: your_jwt_token

## Requests

## User Registration:

POST /auth/register
Content-Type: application/json

{
"email": "user@example.com",
"password": "securePassword123",
"firstName": "John",
"lastName": "Doe",
"phone": "+18761234567"
}

## Roadmap:

    •	Multi-currency wallet support
    •	Secure transfers with validations
    •	Exchange rate service integration
    •	PDF statement exports
    •	i18n (multi-language support)
    •	Mobile-ready API version 2

## Roadmap:

Created by Mc Bellum Lawrence
