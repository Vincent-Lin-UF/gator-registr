# Backend

## Features

- Proxy API for UF Schedule of Classes
- Health check endpoint
- Strict type safety with mypy
- CORS support for frontend integration

## Setup

1. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

2. **Activate the virtual environment:**
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install pre-commit hooks (optional but recommended):**
   ```bash
   pre-commit install
   ```

## Running the Application

### Development Server
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Documentation
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Configuration

Environment variables:
- `FRONTEND_ORIGINS`: Comma-separated list of allowed CORS origins (default: `http://localhost:3000`)

## Development

### Type Checking
```bash
mypy app
```

### Pre-commit Hooks
```bash
pre-commit run --all-files
```

## API Endpoints

- `GET /v1/health` - Health check
- `GET /v1/uf/schedule` - Get UF course schedule (proxy to official UF API)
