# Dark Nexis Backend

This repository contains the backend services for the Dark Nexis platform, a deep fake detection and media analysis system.

## Project Structure

```
dark-nexis-backend/
├── backend/             # FastAPI application
│   ├── app/            # API endpoints and business logic
│   ├── alembic/        # Database migrations
│   ├── Dockerfile      # Container definition for API
│   └── requirements.txt # Python dependencies for API
├── workers/            # Celery workers for media processing
│   ├── worker.py       # Worker task definitions
│   ├── Dockerfile      # Container definition for workers
│   └── requirements.txt # Python dependencies for workers
├── models/             # ML model training and export
│   ├── training/       # Training scripts and utilities
│   ├── export/         # Model export utilities
│   └── README.md       # Model documentation
├── infra/              # Infrastructure as Code
│   ├── aws/            # AWS deployment configurations
│   └── README.md       # Infrastructure documentation
├── tests/              # Test suite
│   ├── test_api.py     # API tests
│   └── test_worker.py  # Worker tests
└── docker-compose.yml  # Local development environment
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.9+
- PostgreSQL (for local development without Docker)
- Redis (for local development without Docker)

### Local Development with Docker

1. Clone the repository:

```bash
git clone https://github.com/your-organization/dark-nexis-backend.git
cd dark-nexis-backend
```

2. Start the development environment:

```bash
docker-compose up -d
```

This will start the following services:
- FastAPI backend on http://localhost:8000
- PostgreSQL database
- Redis for message broker
- Celery workers for media processing

3. Access the API documentation at http://localhost:8000/docs

### Running Tests

```bash
# Run all tests
python -m pytest

# Run specific test file
python -m pytest tests/test_api.py
```

## API Endpoints

- `GET /`: Root endpoint, returns API information
- `GET /health`: Health check endpoint
- `POST /api/v1/media/analyze`: Submit media for analysis
- `GET /api/v1/media/{media_id}`: Get analysis results

## Worker Tasks

- `analyze_media`: Processes uploaded media files for deepfake detection

## Deployment

See the [infrastructure documentation](./infra/README.md) for AWS deployment instructions.

## Model Training

See the [model documentation](./models/README.md) for information on training and exporting models.

## License

[MIT](LICENSE)