# 🚀 Production Deployment Guide

## Smart Traffic Management System

This document provides step-by-step instructions for deploying the **Smart Traffic Management System** in a production environment.

---

## 📋 Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+ & npm
- **Database**: MySQL Server 8.0+
- **Process Manager**: Gunicorn (Linux/Unix) or Waitress (Windows) / systemd
- **Web Server / Reverse Proxy**: Nginx or Apache
- **SSL Certificate**: Certbot / Let's Encrypt (recommended for HTTPS)

---

## ⚙️ 1. Backend Environment & Production Setup

### Step 1: Environment Variables
Create a `.env` file in the `backend/` directory based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```ini
FLASK_ENV=production
SECRET_KEY=generate_a_secure_random_key_here
DATABASE_URL=mysql+pymysql://production_user:secure_password@localhost:3306/traffic_management
PORT=5000
CORS_ORIGINS=https://yourdomain.com
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
pip install gunicorn  # Or waitress on Windows
```

### Step 3: Run with WSGI Production Server
On Linux/Unix using **Gunicorn**:
```bash
gunicorn --workers 4 --bind 127.0.0.1:5000 app:app
```

On Windows using **Waitress**:
```bash
waitress-serve --port=5000 app:app
```

---

## 💻 2. Frontend Production Setup & Build

### Step 1: Production Environment Variables
Create a `.env.production` file in the `frontend/` directory:

```ini
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Step 2: Create Production Bundle
```bash
cd frontend
npm run build
```

The optimized static assets will be generated in `frontend/dist/`.

---

## 🌐 3. Nginx Reverse Proxy Configuration (Sample)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React Static Frontend
    location / {
        root /var/www/smart_traffic/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Flask Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ✅ 4. Post-Deployment Verification Checklist

1. **Database Connection**: Confirm Flask backend connects to MySQL and creates tables cleanly.
2. **API Endpoint Verification**: Test `GET /` and `GET /dashboard/stats` respond with `200 OK`.
3. **CORS Restrictions**: Verify requests from unapproved domains are blocked by CORS.
4. **HTTPS Enforcement**: Ensure HTTPS redirect is active.
5. **Static Assets**: Verify SPA routing and client-side page transitions (`/`, `/detection`, `/users`, `/login`).
