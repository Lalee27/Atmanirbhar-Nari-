# Aatmanirbhar Nari - Setup & Development Guide

## Prerequisites

- **Docker Desktop** - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Node.js** (v18+) - For local development
- **npm** or **yarn** - For package management

---

## 🐳 Docker Setup (Recommended)

### Step 1: Start Docker Services

**Open PowerShell/Terminal in the project root directory and run:**

```powershell
docker-compose up -d
```

This will start:
- **MongoDB** on `mongodb://localhost:27017`
- **Backend Server** on `http://localhost:5000`
- **Mongo Express** (Admin UI) on `http://localhost:8081`

### Step 2: Verify Services are Running

```powershell
docker-compose ps
```

You should see three containers running:
- `aatmanirbhar_nari_mongodb`
- `aatmanirbhar_nari_backend`
- `aatmanirbhar_nari_mongo_express`

### Step 3: Access the Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000 | - |
| MongoDB Admin (Mongo Express) | http://localhost:8081 | `admin` / `admin123` |
| MongoDB Direct | mongodb://admin:secure_password_123@localhost:27017 | `admin` / `secure_password_123` |

---

## 💻 Local Development (Without Docker)

### Step 1: Install MongoDB Locally

Download and install MongoDB Community Edition from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### Step 2: Start MongoDB Service

**Windows (PowerShell):**
```powershell
# MongoDB should auto-start, or manually start it
mongod
```

### Step 3: Setup Environment Variables

Use `.env.local` for local development:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/aatmanirbhar_nari
JWT_SECRET=your_super_secret_key_change_me_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Step 4: Start Backend Server

```powershell
cd server
npm install
npm run dev
```

Server will run on `http://localhost:5000`

### Step 5: Start Frontend

```powershell
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
Aatmanirbhar Nari/
├── client/                 # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend (Node.js)
│   ├── routes/            # API routes
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Auth & validation
│   ├── Dockerfile         # Docker config
│   ├── package.json
│   └── index.js
├── docker-compose.yml     # Docker services config
└── .env                   # Environment variables
```

---

## 🚀 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Businesses
```
GET /api/businesses        # Get all businesses
GET /api/businesses/:id    # Get specific business
POST /api/businesses       # Create business
PUT /api/businesses/:id    # Update business
DELETE /api/businesses/:id # Delete business
```

### Other Routes
- `/api/inquiries` - Handle service inquiries
- `/api/mentor` - Mentorship features
- `/api/admin` - Admin operations
- `/api/upload` - File uploads

---

## 🛑 Stop Docker Services

### Stop all containers
```powershell
docker-compose down
```

### Stop and remove volumes (careful!)
```powershell
docker-compose down -v
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`
- **Solution:** Ensure MongoDB container is running: `docker-compose ps`
- Check connection string in `.env` file

### Port Already in Use
**Error:** `Port 5000 already in use`
- **Solution:** 
  ```powershell
  # Find process using port 5000
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
  
  # Kill the process
  Stop-Process -Id <PID> -Force
  ```

### Docker Desktop Not Running
**Error:** `Cannot connect to Docker daemon`
- **Solution:** Open Docker Desktop application and wait for it to start

### Frontend Can't Connect to Backend
**Error:** CORS or connection errors
- **Solution:** Verify backend is running on port 5000
- Check `CLIENT_URL` in backend `.env` matches frontend URL

---

## 📝 Environment Variables

### Server `.env` (Docker)
```env
PORT=5000
MONGO_URI=mongodb://admin:secure_password_123@mongodb:27017/aatmanirbhar_nari?authSource=admin
JWT_SECRET=your_super_secret_key_change_me_in_production
NODE_ENV=production
CLIENT_URL=http://localhost:3000
```

### Server `.env.local` (Local Development)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aatmanirbhar_nari
JWT_SECRET=your_super_secret_key_change_me_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🔧 Useful Commands

### Docker Commands
```powershell
# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb

# Execute command in container
docker-compose exec backend npm run seed

# Rebuild images
docker-compose build --no-cache

# List all images
docker images

# Remove unused images
docker image prune
```

### MongoDB Commands
```powershell
# Connect to MongoDB
mongosh "mongodb://admin:secure_password_123@localhost:27017/aatmanirbhar_nari?authSource=admin"

# List databases
show databases

# Switch to database
use aatmanirbhar_nari

# List collections
show collections

# View documents
db.users.find()
```

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker and MongoDB logs
3. Verify all environment variables are correct
4. Ensure ports 3000, 5000, 27017, 8081 are not in use

---

**Happy Coding! 🚀**
