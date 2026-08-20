# ============================================
# STAGE 1: Build Stage
# ============================================
FROM python:3.11-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies needed for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements first (leverage Docker cache)
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY app/ .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# ============================================
# STAGE 2: Production Stage
# ============================================
FROM python:3.11-slim

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY app/ .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Use non-root user for security
RUN useradd -m -u 1000 appuser
USER appuser

# Expose port
EXPOSE 5000

# Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]
