# Dark-Nexis

A full-stack web application featuring a dark-themed UI design with integrated deepfake detection capabilities.

## Overview

Dark-Nexis is a production-ready application that combines a modern frontend with a robust backend to provide deepfake detection services. The application features a sleek dark-themed interface built with React and Tailwind CSS, backed by a Python FastAPI backend with PostgreSQL, Redis, and MinIO for data storage.

## Features

- 🌙 **Dark-themed UI**: Modern, accessible interface built with React, TypeScript, and Tailwind CSS
- 🔐 **User Authentication**: Secure login and session management
- 📁 **File Upload**: Secure file handling with S3/MinIO integration
- 🤖 **Deepfake Detection**: ML-powered analysis pipeline
- 💳 **Billing & Subscriptions**: User subscription tracking and billing logic
- 🔁 **Real-time Communication**: WebSocket support for live updates
- 📊 **Analytics Dashboard**: Data visualization and reporting

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Context

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy
- **Caching**: Redis
- **Storage**: MinIO (S3-compatible)
- **Authentication**: JWT/OAuth2
- **Background Jobs**: Celery

### Machine Learning
- **Model**: Custom deepfake detection model
- **Framework**: PyTorch
- **Processing**: Background workers with Celery

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Deployment**: GitHub Actions (CI/CD)

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- Docker (optional, for containerized services)
- PostgreSQL (if not using Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CrazyBong/Dark-Nexis.git
   cd Dark-Nexis
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start backend services**:
   ```bash
   cd dark-nexis-backend
   docker-compose up -d
   ```

4. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. **Start development servers**:
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd dark-nexis-backend/backend
   uvicorn app.main:app --reload
   ```

### Environment Configuration

Create `.env` files in both the root directory and `dark-nexis-backend/` with your configuration.

## Project Structure

```
Dark-Nexis/
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── services/        # API services
│   └── ...
├── dark-nexis-backend/  # Backend services
│   ├── backend/         # FastAPI application
│   ├── workers/         # ML workers
│   ├── docker-compose.yml
│   └── ...
├── README.md
└── ...
```

## Documentation

- [Frontend-Backend Integration Guide](FRONTEND_BACKEND_INTEGRATION_GUIDE.md)
- [Model Training Guide](MODEL_TRAINING_GUIDE.md)
- [Dataset Setup Guide](DATASET_SETUP_GUIDE.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UI design inspired by [Figma Dark-Themed Web UI Design](https://www.figma.com/design/MkP0e0LKuDLAkRdkMR6Vul/Dark-Themed-Web-UI-Design)
- Built with modern web technologies and frameworks