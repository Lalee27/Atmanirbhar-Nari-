# 🚀 Aatmanirbhar Nari - Quick Start Guide

## ⚡ Fastest Way to Get Started (30 seconds)

### Option 1: Using Docker (Recommended) ✅

**1. Start Docker Desktop**
- Open Windows Start menu
- Type "Docker Desktop"
- Click to launch
- Wait for it to fully start (check system tray icon)

**2. Run the Setup Script**
```powershell
# In PowerShell from project root directory
.\start-docker.ps1
```

Or double-click: `start-docker.bat`

**3. Access Services**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB Admin: http://localhost:8081 (admin/admin123)

---

## 💾 Option 2: Local MongoDB Setup

### Install MongoDB

**Windows Installation:**

1. **Download MongoDB Community Edition**
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows (64-bit)" 
   - Download the MSI installer

2. **Install MongoDB**
   - Run the MSI installer
   - Choose "Complete" installation
   - Keep default installation path
   - Install MongoDB Compass (optional but helpful)

3. **Start MongoDB Service**

   **Using Windows Services:**
   - Press `Windows Key + R`
   - Type: `services.msc`
   - Find "MongoDB Server"
   - Right-click → Start
   
   **Or using Command Line:**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

4. **Verify MongoDB is Running**
   ```powershell
   mongosh
   # Should connect successfully
   ```

---

## 🎯 Running Both Frontend & Backend (Local Development)

**Terminal 1 - Start Backend:**
```powershell
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```powershell
cd client
npm run dev
# Runs on http://localhost:3000
```

**That's it!** Open http://localhost:3000 in your browser.

---

## 🐳 Complete Docker Setup (What Gets Installed)

When you run `docker-compose up -d`, you get:

| Service | Port | Access |
|---------|------|--------|
| **MongoDB** | 27017 | `mongodb://admin:secure_password_123@localhost:27017` |
| **Backend API** | 5000 | http://localhost:5000 |
| **Mongo Express** (Admin UI) | 8081 | http://localhost:8081 |
| **Frontend** | 3000 | http://localhost:3000 (run separately) |

---

## 📋 Environment Setup

### For Docker (auto-configured)
- Backend uses Docker MongoDB automatically
- No additional setup needed

### For Local Development
The `.env.local` file is already configured:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aatmanirbhar_nari
JWT_SECRET=your_super_secret_key_change_me_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🔍 Verify Everything Works

### Test Backend API Health
```powershell
# In PowerShell/Command Line
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Aatmanirbhar Nari API is healthy"}
```

### Test MongoDB Connection
```powershell
mongosh "mongodb://localhost:27017/aatmanirbhar_nari"

# Should show: aatmanirbhar_nari>
```

---

## 🛠️ Useful Commands

### Docker Commands
```powershell
# View all services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend

# Remove everything (careful!)
docker-compose down -v
```

### MongoDB Commands (if running locally)
```powershell
# Connect to MongoDB
mongosh

# Switch to your database
use aatmanirbhar_nari

# View collections
show collections

# View documents in a collection
db.users.find()

# Create a test document
db.users.insertOne({ name: "Test", email: "test@example.com" })
```

---

## ❓ Common Issues & Solutions

### Issue: "Cannot connect to Docker daemon"
**Solution:**
1. Make sure Docker Desktop is running
2. Check system tray for Docker icon
3. If not running, start Docker Desktop

### Issue: "MongoDB connection refused"
**Solution:**
1. Check if MongoDB is running: `mongosh`
2. If error, start MongoDB service
3. Or use Docker instead: `.\start-docker.ps1`

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

### Issue: "Frontend can't connect to backend"
**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check CORS settings in `server/index.js`
3. Ensure `CLIENT_URL` is correct in `.env`

---

## 📖 Project Structure

```
Aatmanirbhar Nari/
├── client/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Page Components
│   │   └── services/    # API Service
│   └── package.json
├── server/              # Express.js Backend
│   ├── routes/          # API Endpoints
│   ├── models/          # MongoDB Schemas
│   ├── middleware/      # Auth & Validation
│   └── package.json
├── docker-compose.yml   # Docker Configuration
├── start-docker.bat     # Windows Batch Script
├── start-docker.ps1     # PowerShell Script
└── SETUP.md            # Detailed Setup Guide
```

---

## 🚀 Next Steps

1. **Choose your setup method:**
   - Docker (easier): `.\start-docker.ps1`
   - Local MongoDB (if already installed)

2. **Start the services**
   - Backend: `npm run dev` (server folder)
   - Frontend: `npm run dev` (client folder)

3. **Open in browser**
   - http://localhost:3000

4. **Start building!** 🎉

---

## 📞 Need Help?

1. Check the detailed [SETUP.md](./SETUP.md)
2. Review the [docker-compose.yml](./docker-compose.yml)
3. Check backend logs: `npm run dev` in server folder
4. Check frontend console: Press F12 in browser

---

**Happy coding! 💻✨**
