# 🚦 Smart Traffic Management System

An AI-powered Smart Traffic Management System that optimizes traffic signal timings based on real-time vehicle density using Computer Vision (OpenCV) and dynamic signal algorithms.

This project follows industry-standard Software Development Life Cycle (SDLC) practices, demonstrating full-stack React frontend design, Flask RESTful API architecture, MySQL database modeling, and OpenCV computer vision processing.

---

## 🎯 Key Features

- **📊 Live Traffic Dashboard**: Real-time KPI statistics cards, signal counts, user counts, and complete traffic signal management table.
- **📈 Traffic Analytics & Data Visualizations**: Interactive `Chart.js` Doughnut charts (Active vs Inactive signals) and grouped Bar charts (Green, Yellow, and Red cycle timing per location).
- **🎥 Live OpenCV Vehicle Detection**: Real-time image/frame contour processing, vehicle counting, congestion level classification (`LOW`, `MEDIUM`, `HIGH`), and dynamic green signal timing calculation (`20s + vehicle_count * 3s`).
- **👤 User Management & Authentication**: Tabbed login/registration portal, password security via bcrypt, React Context session persistence, protected client-side routes, and admin user account management (`ADMIN`, `OPERATOR`, `USER`).
- **🔍 Signal Filtering & Search**: Instant location search and status filtering (`ACTIVE` / `INACTIVE`).

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, React Router, Chart.js, React-Chartjs-2, Axios.
- **Backend**: Python 3.10+, Flask, Flask-SQLAlchemy, Flask-CORS, PyMySQL, python-dotenv.
- **Computer Vision**: OpenCV (`opencv-python`), NumPy.
- **Database**: MySQL Server 8.0+.

---

## 📂 Project Architecture & Directory Structure

```text
smart_trafic_management_system/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Environment configuration loader
│   ├── routes.py              # API route registry
│   ├── controllers/           # HTTP request handlers
│   ├── services/              # Business logic & OpenCV engine
│   ├── models/                # SQLAlchemy database models
│   ├── database/              # DB connection initialization
│   └── .env.example           # Backend environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components (dashboard, signals, users, layout)
│   │   ├── context/           # React AuthContext
│   │   ├── pages/             # Dashboard, Detection, Users, Login pages
│   │   └── services/          # Axios API service layer (api.js, signalService.js, etc.)
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example           # Frontend environment template
│
├── docs/
│   ├── deployment_guide.md    # Production deployment documentation
│   ├── database_design.md    # Database ER diagrams and schema specifications
│   └── system_architecture.mcd
├── .gitignore                 # Root Git exclusion rules
└── README.md                  # Project documentation
```

---

## ⚡ Quick Start & Development Setup

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment & install dependencies**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Configure your local MySQL connection in `DATABASE_URL`.*

4. **Run Development Server**:
   ```bash
   python app.py
   ```
   *Backend starts at `http://127.0.0.1:5000`.*

---

### 2. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file based on `.env.example`:
   ```bash
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   *Frontend starts at `http://localhost:5173`.*

---

## 📦 Production Build Instructions

To generate optimized static assets for production deployment:

```bash
cd frontend
npm run build
```

The production assets will be generated in `frontend/dist/`. Refer to [docs/deployment_guide.md](docs/deployment_guide.md) for production server setup.

---

## 👨‍💻 Author

**Rohan Parkale**
- MCA Student & Full-Stack / ML Developer
