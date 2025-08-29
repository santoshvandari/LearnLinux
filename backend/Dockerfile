# Simple Production Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    firejail \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Create non-root user
RUN useradd -m -u 1000 appuser && \
    useradd -m -u 2000 sandbox_user

# Copy application code
COPY . .

# Set ownership
RUN chown -R appuser:appuser /app

# Create directories for workspaces
RUN mkdir -p /tmp/terminal_sessions && \
    chown appuser:appuser /tmp/terminal_sessions

# Create basic firejail profile
RUN echo 'caps.drop all\nseccomp\nnet none\nnoroot\nprivate-tmp\ntimeout 3600' > /etc/firejail/terminal.profile

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check

# Run with daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]