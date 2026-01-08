# School Admin Panel (Frontend) - Docker Setup

React/Vite frontend application with Docker support.

## Quick Start

1. **Navigate to the frontend directory**:
   ```bash
   cd school-admin-panel
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp .env.docker .env
   # Edit .env to set VITE_API_URL if needed
   ```

3. **Build and start the container**:
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000

## Configuration

### Environment Variables

Create a `.env` file or set these in `docker-compose.yml`:

```env
VITE_API_URL=http://localhost:8000
```

### Port Configuration

Default port is `3000`. To change it, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 3000 to 8080
```

## Docker Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

## Development Notes

- The Dockerfile uses a multi-stage build for optimized production images
- Static files are served via Nginx for better performance
- The build process runs `npm run build` which compiles TypeScript and bundles assets

## File Structure

```
school-admin-panel/
├── Dockerfile              # Frontend Docker configuration
├── docker-compose.yml      # Orchestration for frontend only
├── nginx.conf             # Nginx configuration
├── .dockerignore          # Files to exclude from Docker build
└── .env.docker           # Environment template
```

## Connecting to Backend

Make sure the backend API is running and accessible at the URL specified in `VITE_API_URL`.

If running both frontend and backend with Docker:
1. Start backend first: `cd ../school-manager-api && docker-compose up -d`
2. Then start frontend: `cd ../school-admin-panel && docker-compose up -d`

## Troubleshooting

### Cannot connect to API
- Verify `VITE_API_URL` is set correctly
- Ensure backend is running and accessible
- Check CORS settings in backend

### Build failures
- Clear Docker cache: `docker-compose build --no-cache`
- Check Node.js version compatibility

### Port already in use
Change the port mapping in `docker-compose.yml`
