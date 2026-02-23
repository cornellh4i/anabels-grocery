FROM node:20

# Install PostgreSQL
RUN apt-get update && \
    apt-get install -y postgresql && \
    apt-get clean

# Create postgres data directory with correct permissions
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql

RUN echo "service postgresql start" >> /root/.bashrc

WORKDIR /workspace