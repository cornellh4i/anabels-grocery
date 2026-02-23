#!/bin/bash
service postgresql start
sleep 2

su - postgres -c "psql" <<EOF
CREATE DATABASE "anabels-grocery";
CREATE USER appuser WITH PASSWORD 'anabelsgrocery';
GRANT ALL PRIVILEGES ON DATABASE "anabels-grocery" TO appuser;
ALTER USER appuser CREATEDB;
EOF

su - postgres -c "psql -d anabels-grocery" <<EOF
GRANT ALL ON SCHEMA public TO appuser;
EOF

cd /workspaces/anabels-grocery
npm install
npx prisma migrate dev --name init