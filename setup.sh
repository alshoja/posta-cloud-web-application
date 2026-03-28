#!/bin/bash
# ===============================
# start.sh - cross-platform dev setup
# Linux / macOS version
# ===============================
set -e

# Step 0: copy .env.example to .env if not exists
if [ ! -f ".env" ]; then
  echo "🔹 Creating .env from .env.example..."
  cp .env.example .env
fi

# Step 1: fix permissions (optional, avoids npm EACCES errors)
echo "🔹 Fixing project folder permissions..."
sudo chown -R $USER:$USER .

# Step 2: install backend dependencies
echo "🔹 Installing backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Step 3: install frontend dependencies
echo "🔹 Installing frontend dependencies..."
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Step 4: bring up Docker Compose
echo "🔹 Bringing up Docker Compose..."
docker compose down -v
docker compose up -d --build

echo "✅ Setup complete!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "pgAdmin: http://localhost:8080 (Email: admin@example.com, Password: admin123)"