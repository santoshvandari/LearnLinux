# Simple Production Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    firejail \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Create non-root user with restricted privileges
RUN useradd -m -u 1000 -s /bin/false appuser && \
    useradd -m -u 2000 -s /bin/false sandbox_user

# Copy application code
COPY . .

# Set ownership
RUN chown -R appuser:appuser /app

# Create secure directories for workspaces with strict permissions
RUN mkdir -p /tmp/terminal_sessions && \
    chown appuser:appuser /tmp/terminal_sessions && \
    chmod 755 /tmp/terminal_sessions

# Create secure firejail profile with strict restrictions
RUN echo 'caps.drop all\n\
seccomp\n\
net none\n\
noroot\n\
private-tmp\n\
private-dev\n\
private-etc\n\
timeout 300\n\
blacklist /home\n\
blacklist /root\n\
blacklist /etc\n\
blacklist /var\n\
blacklist /opt\n\
blacklist /media\n\
blacklist /mnt\n\
blacklist /usr/bin\n\
blacklist /bin\n\
blacklist /sbin\n\
private-bin sh,bash,ls,pwd,cat,mkdir,rmdir,rm,touch,echo,whoami,id,ps,grep,find,head,tail,wc,sort,uniq\n\
read-only /usr/lib\n\
read-only /lib\n\
rlimit-nproc 10\n\
rlimit-fsize 10485760\n\
nonewprivs\n\
nosound\n\
nodvd\n\
notv\n\
nou2f\n\
novideo\n\
no3d' > /etc/firejail/terminal.profile

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python manage.py check || exit 1

# Run with daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]