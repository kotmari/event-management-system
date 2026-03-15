# Backend .env
DATABASE_URL=postgresql://user:password@db:5432/events_db
PORT=5001
JWT_SECRET=your_super_secret_key
REFRESH_TOKEN_SECRET=your_super_secret_key

# Frontend
VITE_API_BASE_URL="http://localhost:5001/api"

## This will automatically:

Build the backend and frontend containers.

Initialize the PostgreSQL database.

Run Prisma migrations.

Start the services.

Once completed, you can access:

Frontend: http://localhost:5173

Backend API: http://localhost:5001

## 🛠 Project Structure
/backend - Node.js, Express, Prisma, TypeScript.

/frontend - React, Vite, Tailwind CSS, React Hook Form.

docker-compose.yml - Orchestrates the containers.

## 📝 Troubleshooting
Database connection errors: Ensure your DATABASE_URL in the .env matches the POSTGRES credentials in docker-compose.yml.

Port conflicts: If ports 5001 or 5173 are already in use, update the mappings in docker-compose.yml.
