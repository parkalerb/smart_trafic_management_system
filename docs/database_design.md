# 🗄️ Database Design

# Smart Traffic Management System

## 📖 Overview

The database is designed to store information related to users, traffic signals, vehicles, and traffic logs. It supports real-time traffic monitoring and future analytics.

---

# Database

MySQL

---

# Tables

## 1. Users

Purpose:
Store administrator and operator information.

| Column | Data Type | Description |
|---------|-----------|-------------|
| id | INT | Primary Key |
| name | VARCHAR(100) | User Name |
| email | VARCHAR(100) | Email Address |
| password | VARCHAR(255) | Encrypted Password |
| role | VARCHAR(30) | Admin / Operator |

---

## 2. Traffic Signals

Purpose:
Store traffic signal information.

| Column | Data Type | Description |
|---------|-----------|-------------|
| signal_id | INT | Primary Key |
| location | VARCHAR(100) | Signal Location |
| green_time | INT | Green Signal Time |
| yellow_time | INT | Yellow Signal Time |
| red_time | INT | Red Signal Time |

---

## 3. Vehicles

Purpose:
Store detected vehicle information.

| Column | Data Type | Description |
|---------|-----------|-------------|
| vehicle_id | INT | Primary Key |
| vehicle_type | VARCHAR(50) | Car, Bike, Bus, Truck |
| detected_time | DATETIME | Detection Time |
| signal_id | INT | Related Traffic Signal |

---

## 4. Traffic Logs

Purpose:
Store daily traffic statistics.

| Column | Data Type | Description |
|---------|-----------|-------------|
| log_id | INT | Primary Key |
| signal_id | INT | Related Signal |
| vehicle_count | INT | Number of Vehicles |
| congestion_level | VARCHAR(20) | Low / Medium / High |
| log_time | DATETIME | Record Time |

---

# Relationships

Users

↓

Traffic Signals

↓

Vehicles

↓

Traffic Logs

---

# Primary Keys

- id
- signal_id
- vehicle_id
- log_id

---

# Foreign Keys

- Vehicles.signal_id → TrafficSignals.signal_id
- TrafficLogs.signal_id → TrafficSignals.signal_id

---

# Future Tables

- Emergency Vehicles
- CCTV Cameras
- Notifications
- Traffic Violations

---

# Benefits

- Easy to manage
- Scalable
- Supports analytics
- Easy integration with AI modules

---

## Status

✅ Database Design Completed