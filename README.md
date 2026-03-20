# 🚀 Event Management System with AI Assistant
A full-stack application for managing events, featuring an integrated AI Assistant (powered by Groq Llama 3.3), built with a robust TypeScript stack and containerized with Docker.

## ⚡️ Quick Start

1. **Clone the repository:**
   git clone <your-repo-url>
   cd <project-folder>

2. **Setup environment variables:**
   Create two `.env` files: one in the /backend folder and another in the /frontend folder.    

 3. **Launch the project:** 
    Run the following command to build and start the application and backend services:

   ` docker-compose up --build`


## 🛠 Technology Stack
Frontend: React (Vite), TypeScript, Tailwind CSS, Zustand, Axios, Lucide React.

Backend: Node.js, Express, Prisma ORM, TypeScript, Groq SDK.

Database: PostgreSQL (Cloud-based via Neon.tech).

DevOps: Docker, Docker Compose.

## For /backend/.env:
PORT=5001
DATABASE_URL="postgresql://user:password@ep-lucky-area-12345.eu-central-1.aws.neon.tech/events_db?sslmode=require"
JWT_SECRET="your_super_secret_key"
REFRESH_TOKEN_SECRET="your_another_secret_key"
GROQ_API_KEY="your_groq_api_key"
GROQ_MODEL="llama-3.3-70b-versatile"

## For /frontend/.env:

VITE_API_BASE_URL="http://localhost:5001/api"


## ⚠️ Troubleshooting (Post-Docker Installation)
If you encounter missing module errors or command failures after Docker setup, please run the following manually:


# For Backend
cd backend && npm install && npx prisma generate

# For Frontend
cd frontend && npm install


## 🏗 Project Structure
/backend — Node.js API, Prisma schemas (Neon DB), AI Assistant logic, and Auth.

/frontend — React client, Zustand stores, and AI Chat Sidebar.

docker-compose.yml — Orchestrates frontend and backend services.

## 🔗 Access Points
Frontend: http://localhost:5173

Backend API: http://localhost:5001

API Docs (Swagger): http://localhost:5001/api-docs

Port conflicts: If ports 5001 or 5173 are already in use, update the mappings in docker-compose.yml.
