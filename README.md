# URL Management System

A production-ready URL shortening and management system built with Next.js.

## Features

- URL shortening with custom aliases
- QR code generation
- Analytics tracking
- User authentication
- Team collaboration
- API access
- Redis caching

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Prisma (PostgreSQL)
- Redis
- TailwindCSS
- Jest
- Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/url-management-system.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development environment
```bash
docker-compose up -d
npm run dev
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Deployment

1. Build the Docker image
```bash
docker build -t url-management-system .
```

2. Deploy using Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## API Documentation

API documentation is available at `/api/docs` when running the development server.

## Security

- JWT authentication
- Rate limiting
- Input validation
- CORS protection
- Security headers
- Data encryption

## Monitoring

- Logging with Pino
- Error tracking with Sentry
- Performance monitoring
- Health checks

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.