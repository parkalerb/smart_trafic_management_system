# 🗄️ Database Design

# Smart Traffic Management System

## 📖 Overview

The database stores information related to traffic signals, detected vehicles, users, and traffic logs. It is designed to support real-time monitoring and future AI-based traffic analysis.

---

# Database

MySQL

---

# Entities

## 1. Users

Stores administrator and operator information.

### Attributes

- user_id (Primary Key)
- name
- email
- password
- role

---

## 2. Traffic Signals

Stores traffic signal details.

### Attributes

- signal_id (Primary Key)
- location
- green_time
- yellow_time
- red_time

---

## 3. Vehicles

Stores detected vehicle information.

### Attributes

- vehicle_id (Primary Key)
- vehicle_type
- detected_time
- signal_id (Foreign Key)

---

## 4. Traffic Logs

Stores traffic statistics.

### Attributes

- log_id (Primary Key)
- signal_id (Foreign Key)
- vehicle_count
- congestion_level
- log_time

---

# Relationships

Users
│
├── Manage
│
▼

Traffic Signals
│
├── Detect
│
▼

Vehicles
│
├── Generate
│
▼

Traffic Logs

---

# Keys

## Primary Keys

- user_id
- signal_id
- vehicle_id
- log_id

---

## Foreign Keys

Vehicles.signal_id

↓

TrafficSignals.signal_id

TrafficLogs.signal_id

↓

TrafficSignals.signal_id

---

# Relationship Type

Users

1

↓

N

Traffic Signals

Traffic Signals

1

↓

N

Vehicles

Traffic Signals

1

↓

N

Traffic Logs

---

# ER Diagram

See:

images/er_diagram.png

---

# Future Tables

- Emergency Vehicles
- CCTV Cameras
- Notifications
- Traffic Violations

---

## Status

✅ Database Design Updated