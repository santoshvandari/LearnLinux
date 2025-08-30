# Simple Production Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEVELOPMENT=False \
    DJANGO_SETTINGS_MODULE=core.settings

# Install system dependencies and learning tools
RUN apt-get update && apt-get install -y \
    # Essential tools
    curl wget git vim nano \
    # System tools
    htop tree file less procps \
    # Network tools  
    iputils-ping iproute2 dnsutils net-tools \
    # Text processing
    jq grep sed gawk \
    # Compression tools
    zip unzip gzip \
    # Optional: firejail for additional isolation layer
    firejail \
    # Clean up
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

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

# Create secure firejail profile with balanced restrictions - more permissive for learning
RUN echo 'caps.drop all\n\
seccomp\n\
net none\n\
noroot\n\
private-tmp\n\
private-dev\n\
timeout 3600\n\
blacklist /home\n\
blacklist /root\n\
blacklist /boot\n\
blacklist /sys\n\
blacklist /proc/sys\n\
private-bin sh,bash,ls,pwd,cat,mkdir,rmdir,rm,touch,echo,whoami,id,ps,grep,find,head,tail,wc,sort,uniq,cp,mv,chmod,chown,ln,file,which,type,man,less,more,tree,du,df,free,top,htop,kill,killall,python,python3,pip,pip3,node,npm,gcc,g++,make,vim,vi,nano,emacs,git,curl,wget,tar,gzip,gunzip,zip,unzip,awk,sed,cut,tr,basename,dirname,date,cal,uptime,uname,history,alias,unalias,jobs,fg,bg,sleep,ping,nslookup,dig,netstat,ss,lsof\n\
read-only /usr/lib\n\
read-only /lib\n\
rlimit-nproc 50\n\
rlimit-fsize 104857600\n\
rlimit-as 1073741824\n\
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