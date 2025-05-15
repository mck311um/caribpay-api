# Starting Development Server

## Development Scripts

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

## Running Tests

To run tests, make sure to configure your test environment properly by setting up a separate .env.test file and use the correct testing framework.

1. Create .env.test
   Create a `.env.test` file for your testing environment to ensure that tests run using a separate database and configuration. For example:

2. Testing with Jest & Supertest
   You can run tests using the test script, which loads the .env.test environment file.

```bash
npm run test
```

This will run your tests using the environment variables in .env.test.
