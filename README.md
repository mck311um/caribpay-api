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

| Component      | Technology                            |
| -------------- | ------------------------------------- |
| Backend        | Node.js + Express.js                  |
| Database       | PostgreSQL + Prisma ORM               |
| Language       | TypeScript                            |
| Authentication | JWT with refresh tokens               |
| API Security   | Helmet, CORS, rate limiting           |
| Testing        | Jest + Supertest                      |
| Documentation  | Markdown (`/docs`), Swagger (planned) |
| DevOps         | GitHub Actions, AWS Elastic Beanstalk |

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

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Set up database

   ```bash
   ./migrate.sh
   ```

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

### Running Tests

To run tests, make sure to configure your test environment properly by setting up a separate .env.test file and use the correct testing framework.

1. Create .env.test
   Create a `.env.test` file for your testing environment to ensure that tests run using a separate database and configuration. For example:

2. Testing with Jest & Supertest
   You can run tests using the test script, which loads the .env.test environment file.

```bash
npm run test
```

This will run your tests using the environment variables in .env.test.
If you’d like to run tests using the live environment (for example, to test production configurations), you can use the test:live script:

```bash
npm run test:live
```

### API Documentation

The API follows RESTful principles and uses JSON for requests and responses.
For full API reference, see [docs/api-reference.md](docs/api-reference.md)

## Deployment to AWS

You can deploy the CaribPay API to the cloud using AWS Elastic Beanstalk:

### 1. Install Elastic Beanstalk CLI

```bash
pip install awsebcli
```

### 2. Initialize the Project

```bash
eb init -p node.js caribpay-api --region us-east-1
```

Follow the prompts:

- Choose your AWS access key
- Create or select a keypair

### 3. Create the Environment

```bash
eb create caribpay-env
```

### 4 Add Environment Variables

You can configure secrets in the AWS Console under:
Elastic Beanstalk → Configuration → Software → Environment Properties

Add:

- DATABASE_URL
- JWT_SECRET
- PORT
- NODE_ENV=production

### 5 Deploy

After deployment, your app will be live at:
`http://caribpay-env.eba-xyz123.us-east-1.elasticbeanstalk.com`

---

### Optional

You can also use the `./deploy.sh` script to automate setup and deployment.

> **Note:** Before running the script, make sure to **update the environment variables** inside `deploy.sh` with your own `DATABASE_URL`, `JWT_SECRET`, and other sensitive values.

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Scalability

CaribPay is built with scalability in mind to support increasing user demands and transaction volume across the Caribbean. Here’s how:

### Horizontal Scaling

- **Stateless API**: The Express server is stateless and can be easily scaled horizontally using AWS Elastic Beanstalk, ECS, or any container orchestration platform.
- **Load Balancing**: Can be integrated with AWS ELB or NGINX to distribute traffic across multiple instances.

### Database Scaling

- **Read/Write Separation (Planned)**: Future implementation of read replicas and write masters for PostgreSQL to handle read-heavy workloads.
- **Connection Pooling**: Prisma uses efficient connection pooling for concurrent database access.

### Caching (Planned)

- **Redis or Memcached**: Planned integration of Redis for caching frequently accessed data like exchange rates and wallet balances.

### Task Offloading

- **Background Jobs**: Long-running or delayed tasks (like notifications or scheduled maintenance) can be offloaded to job queues using BullMQ or RabbitMQ.
- **Webhook Support**: Funding confirmation and third-party integration via secure webhook endpoints.

### Rate Limiting

- **Per-IP Throttling**: Built-in rate limiting protects against abuse and DoS attacks.
- **Role-Based Throttling (Planned)**: Higher-tier users may get higher rate limits and transaction throughput.

### Monitoring & Alerts

- **Health Checks**: Integrated health endpoints for uptime monitoring.
- **Logging**: Structured logs for request tracing and audit logs for financial operations.
- **Future Integration**: CloudWatch or LogDNA for centralized logging and Prometheus/Grafana for performance metrics.

## About

Created by Mc Kellum Lawrence
