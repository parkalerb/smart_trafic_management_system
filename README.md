🚦 Smart Traffic Management System

An AI-powered Smart Traffic Management System that optimizes traffic signal timings based on vehicle density using Computer Vision (OpenCV) and dynamic signal algorithms.

The project is a complete full-stack application built with React + Vite, Flask REST APIs, MySQL, and OpenCV. It includes authentication, role-based access control, traffic signal management, dashboard analytics, vehicle detection, congestion classification, and dynamic green-signal timing.

The system was developed using an industry-oriented Software Development Life Cycle (SDLC) approach and is deployed for production use.

🌐 Live Demo

Frontend

Live Application:
https://smart-traffic-management-frontend.onrender.com

Backend API

Backend Service:
https://smart-trafic-management-system.onrender.com

Database

Production Database: Aiven MySQL

🎯 Project Objectives

Monitor and analyze traffic conditions through a centralized dashboard.

Detect vehicles using OpenCV-based computer vision processing.

Calculate vehicle density and classify congestion levels.

Dynamically optimize traffic signal green time based on detected traffic.

Provide traffic signal search, filtering, and management.

Provide secure authentication and role-based access control.

Provide separate access levels for ADMIN, OPERATOR, and USER.

Visualize traffic and signal statistics using interactive charts.

Deploy the complete application using cloud services.

✨ Key Features

📊 Live Traffic Dashboard

Total traffic signal count.

Active and inactive signal statistics.

Total registered user count.

Average and maximum green timing.

Active signal percentage.

Traffic analytics and visualizations.

Signal timing comparison by location.

📈 Traffic Analytics

Active vs inactive signal Doughnut chart.

Green, Yellow, and Red timing Bar chart.

Location-based traffic signal analysis.

Dashboard KPI cards.

Responsive data visualization using Chart.js.

🎥 OpenCV Vehicle Detection

Vehicle detection using OpenCV.

Image/frame processing.

Gaussian blur and contour-based processing.

Vehicle counting.

Traffic congestion classification.

Dynamic green signal timing calculation.

Detection result visualization.

🚦 Dynamic Traffic Signal Optimization

The implemented signal timing logic uses:

Green Time = 20 seconds + (Vehicle Count × 3 seconds)

For example:

Vehicle Count = 5

Green Time = 20 + (5 × 3)
           = 35 seconds

The calculated timing is integrated into the traffic signal workflow.

🔐 Authentication & Role-Based Access Control

The application supports:

ADMIN

OPERATOR

USER

Each role has different permissions and access levels.

🔍 Signal Search & Filtering

Search signals by location.

Filter signals by active/inactive status.

View traffic signal timings.

Manage signals according to user permissions.

🖥️ Application Screenshots

The following screenshots showcase the major functionality of the deployed system.

Note: Authentication/register and user-management screenshots are intentionally not included here because they contain test/user email information.

👨‍💼 ADMIN

📊 Admin Dashboard & Analytics



The admin dashboard provides KPI cards, signal statistics, traffic analytics, and signal timing visualizations.

🚦 Admin Traffic Signal Directory



Administrators can search, filter, view, and manage traffic signals.

🎥 Admin Vehicle Detection



The detection module displays vehicle detection results, traffic density, and dynamic signal timing information.

👷 OPERATOR

📊 Operator Dashboard & Analytics



Operators can monitor traffic conditions and review dashboard analytics.

🎥 Operator Vehicle Detection



Operators can use the vehicle detection module for traffic monitoring and signal optimization.

👤 USER

📊 User Dashboard



Users have access to the dashboard and traffic information according to their assigned permissions.

🎥 User Detection — View Mode



Users can view traffic detection information without administrative management permissions.

🔐 Role-Based Access Control

Feature

ADMIN

OPERATOR

USER

Authentication

✅

✅

✅

Dashboard

✅

✅

✅

Traffic Analytics

✅

✅

✅

View Traffic Signals

✅

✅

✅

Manage Traffic Signals

✅

✅

❌

Vehicle Detection

✅

✅

View

Dynamic Signal Timing

✅

✅

View

User Management

✅

❌

❌

🏗️ System Architecture

                         SMART TRAFFIC MANAGEMENT SYSTEM
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
          ┌───────────────────┐               ┌───────────────────┐
          │   React Frontend  │               │   Flask Backend   │
          │   Vite            │◄─────────────►│   REST APIs       │
          │   React Router    │     HTTP      │   Controllers     │
          │   Axios           │               │   Services        │
          └───────────────────┘               └─────────┬─────────┘
                                                        │
                                  ┌─────────────────────┼─────────────────────┐
                                  │                     │                     │
                                  ▼                     ▼                     ▼
                         ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
                         │ OpenCV Engine  │   │ SQLAlchemy ORM │   │ Authentication │
                         │ Vehicle        │   │                │   │ & RBAC         │
                         │ Detection      │   │                │   │                │
                         └────────────────┘   └───────┬────────┘   └────────────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │   Aiven MySQL   │
                                             │   Production DB │
                                             └─────────────────┘

🔄 How the System Works

Traffic Image / Frame
        │
        ▼
OpenCV Processing
        │
        ▼
Vehicle Detection
        │
        ▼
Vehicle Count
        │
        ▼
Congestion Classification
LOW / MEDIUM / HIGH
        │
        ▼
Dynamic Green-Time Calculation
        │
        ▼
Flask REST API
        │
        ▼
MySQL Database
        │
        ▼
React Dashboard
        │
        ▼
Traffic Monitoring & Signal Management

🧠 Computer Vision & Traffic Logic

The vehicle detection workflow uses OpenCV and NumPy for image/frame processing.

Processing Flow

Input Frame
    ↓
Image Pre-processing
    ↓
Gaussian Blur
    ↓
Contour Detection
    ↓
Vehicle Area Filtering
    ↓
Vehicle Count
    ↓
Congestion Level
    ↓
Dynamic Green Time

Dynamic Timing Formula

Base Green Time = 20 seconds
Vehicle Factor  = 3 seconds per vehicle

Optimized Green Time
= 20 + (vehicle_count × 3)

Example:

Detected Vehicles : 5
Green Time        : 35 seconds

🗄️ Database

The application uses MySQL with SQLAlchemy ORM.

The database layer stores application information such as:

Users

Traffic signals

Signal status

Green timing

Yellow timing

Red timing

Traffic-related system data

Production database:

Aiven MySQL

Database design documentation:

docs/database_design.md

🔌 REST API

The Flask backend provides RESTful endpoints for the frontend.

Authentication

POST /users/register
POST /users/login
POST /users/logout
GET  /users/me

Traffic Signals

GET    /signals
POST   /signals
GET    /signals/<signal_id>
PUT    /signals/<signal_id>
DELETE /signals/<signal_id>
GET    /signals/search
GET    /signals/filter

Users

GET    /users
GET    /users/<user_id>
PUT    /users/<user_id>
DELETE /users/<user_id>

Dashboard

GET /dashboard/stats
GET /dashboard/analytics

Vehicle Detection

GET  /detection/status/<signal_id>
POST /detection/process

🛠️ Technology Stack

Frontend

React

Vite

React Router

Axios

Chart.js

React-Chartjs-2

HTML5

CSS3

JavaScript

Backend

Python

Flask

Flask-SQLAlchemy

Flask-CORS

PyMySQL

python-dotenv

Werkzeug

Computer Vision

OpenCV

NumPy

Contour-based processing

Gaussian Blur

Database

MySQL

SQLAlchemy ORM

Aiven MySQL for production

Development & Testing

Visual Studio Code

Git

GitHub

Postman

Deployment

Render — Frontend

Render — Backend

Aiven — MySQL

📂 Project Structure

smart_trafic_management_system/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── routes.py
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── database/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── screenshots/
│   │   ├── admin/
│   │   │   ├── dashboard.png
│   │   │   ├── traffic_signals.png
│   │   │   └── detection.png
│   │   ├── operator/
│   │   │   ├── dashboard.png
│   │   │   └── detection.png
│   │   └── user/
│   │       ├── dashboard.png
│   │       └── detection.png
│   │
│   ├── deployment_guide.md
│   ├── database_design.md
│   └── system_architecture.mcd
│
├── .gitignore
└── README.md

⚡ Quick Start

Backend

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv .venv

Windows

.venv\Scripts\activate

Linux / macOS

source .venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Create a .env file from .env.example and configure the database and secret key.

Run the backend:

python app.py

Backend:

http://127.0.0.1:5000

Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Create:

frontend/.env

Add:

VITE_API_BASE_URL=http://127.0.0.1:5000

Run:

npm run dev

Frontend:

http://localhost:5173

🔑 Environment Variables

Backend

FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=mysql+pymysql://username:password@localhost/database

Frontend

VITE_API_BASE_URL=http://127.0.0.1:5000

For production, configure environment variables directly in the deployment platform.

Never commit real passwords, database credentials, API keys, or production secret keys to GitHub.

📦 Production Build

Build the frontend:

cd frontend
npm run build

Production assets are generated in:

frontend/dist/

The deployed application uses:

Frontend → Render
Backend  → Render
Database → Aiven MySQL

🧪 Testing & Verification

The completed system was tested across the following areas:

User registration and login.

Authentication/session handling.

Protected routes.

Role-based access control.

Traffic signal CRUD operations.

Signal search and filtering.

Dashboard statistics.

Dashboard analytics.

Vehicle detection.

Congestion classification.

Dynamic green-time calculation.

Frontend/backend API communication.

Production database connectivity.

Production deployment.

📚 Documentation

Additional project documentation is available in the docs/ directory:

docs/
├── deployment_guide.md
├── database_design.md
├── system_architecture.mcd
└── screenshots/

🏆 Project Highlights

This project demonstrates practical experience with:

Full-stack application development.

REST API architecture.

React component-based development.

Flask backend development.

MySQL database design and integration.

SQLAlchemy ORM.

Authentication and authorization.

Role-Based Access Control.

Computer Vision with OpenCV.

Vehicle density analysis.

Dynamic traffic signal optimization.

Data visualization with Chart.js.

Environment-based configuration.

Git/GitHub workflow.

Cloud deployment.

SDLC-oriented project development.

🔮 Future Enhancements

Potential future improvements include:

Real CCTV/video-stream integration.

Advanced vehicle detection using YOLO.

Multi-camera intersection monitoring.

Historical traffic trend analysis.

Machine Learning-based traffic prediction.

Emergency vehicle priority detection.

IoT-based traffic signal controller integration.

Real-time notifications and alerts.

Mobile application for traffic operators.

Advanced cloud monitoring and observability.

✅ Project Status

🎉 Completed & Deployed

The core Smart Traffic Management System has been completed and deployed.

Implemented

✅ React + Vite frontend

✅ Flask REST API backend

✅ MySQL database

✅ Aiven production database

✅ Authentication

✅ Role-based access control

✅ Admin / Operator / User roles

✅ Traffic signal management

✅ Search and filtering

✅ Dashboard KPIs

✅ Chart.js analytics

✅ OpenCV vehicle detection

✅ Congestion classification

✅ Dynamic green signal timing

✅ Production environment configuration

✅ Render frontend deployment

✅ Render backend deployment

✅ Production frontend-backend integration

✅ Final project documentation

👨‍💻 Author

Rohan Parkale

MCA Student | Full-Stack & ML Developer

GitHub: https://github.com/parkalerb

Portfolio: https://rohanparkale.netlify.app

⭐ Show Your Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.