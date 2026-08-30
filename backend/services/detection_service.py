import cv2
import numpy as np
import base64
from models import TrafficSignal, TrafficDetection
from database.db import db

def process_frame_detection(image_bytes=None):
    """
    Process image bytes using OpenCV (cv2) and numpy to detect vehicle contours.
    Returns vehicle_count and processed contour data.
    """
    if image_bytes:
        # Decode image from bytes using OpenCV and numpy
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return 0
    else:
        # Generate a synthetic traffic frame using numpy and cv2 for OpenCV analysis
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        # Draw synthetic vehicle rectangles for contour detection
        np.random.seed(int(cv2.getTickCount()) % 100000)
        num_synthetic = np.random.randint(3, 16)
        for _ in range(num_synthetic):
            x = np.random.randint(50, 550)
            y = np.random.randint(50, 400)
            w = np.random.randint(30, 70)
            h = np.random.randint(40, 90)
            cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 255), -1)

    # OpenCV Image Preprocessing Pipeline
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY)

    # Find contours representing vehicle shapes
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours by minimum area (representing vehicle size)
    min_vehicle_area = 500
    vehicle_contours = [c for c in contours if cv2.contourArea(c) >= min_vehicle_area]
    vehicle_count = len(vehicle_contours)

    return vehicle_count

def calculate_green_time(vehicle_count, base_green=20, time_per_vehicle=3, min_green=15, max_green=90):
    """
    Calculate dynamic green signal time based on detected vehicle count.
    """
    raw_green = base_green + (vehicle_count * time_per_vehicle)
    return max(min_green, min(max_green, raw_green))

def get_congestion_level(vehicle_count):
    """
    Determine traffic congestion level from vehicle count.
    """
    if vehicle_count < 5:
        return "LOW"
    elif vehicle_count <= 12:
        return "MEDIUM"
    else:
        return "HIGH"

def run_detection_for_signal(signal_id, update_db=True, image_base64=None):
    """
    Run vehicle detection for a specific traffic signal, calculate dynamic green time,
    save detection history record, and update signal configuration in database if requested.
    """
    signal = TrafficSignal.query.get(signal_id)
    if signal is None:
        return {
            "success": False,
            "message": f"Traffic signal with ID {signal_id} not found."
        }

    image_bytes = None
    if image_base64:
        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            print("Error decoding image base64:", e)

    # Execute OpenCV vehicle detection
    vehicle_count = process_frame_detection(image_bytes)

    # Dynamic Green Time & Congestion calculation
    calculated_green = calculate_green_time(vehicle_count)
    congestion_level = get_congestion_level(vehicle_count)

    # Save detection history record
    detection_record = TrafficDetection(
        signal_id=signal.id,
        vehicle_count=vehicle_count,
        congestion_level=congestion_level,
        green_time=calculated_green
    )
    db.session.add(detection_record)

    # Update signal green_time in database if requested
    if update_db:
        signal.green_time = calculated_green

    db.session.commit()

    return {
        "success": True,
        "message": "Vehicle detection completed successfully.",
        "data": {
            "id": detection_record.id,
            "signal_id": signal.id,
            "location": signal.location,
            "camera_status": "ONLINE",
            "vehicle_count": vehicle_count,
            "congestion_level": congestion_level,
            "calculated_green_time": calculated_green,
            "previous_green_time": signal.green_time,
            "yellow_time": signal.yellow_time,
            "red_time": signal.red_time,
            "signal_status": signal.status,
            "detected_at": detection_record.detected_at.isoformat() if detection_record.detected_at else None
        }
    }

def get_signal_detection_status(signal_id):
    """
    Fetch current detection status for a traffic signal.
    """
    signal = TrafficSignal.query.get(signal_id)
    if signal is None:
        return None

    # Estimate count from current green time for status display
    estimated_count = max(0, int((signal.green_time - 20) / 3))
    congestion_level = get_congestion_level(estimated_count)

    return {
        "signal_id": signal.id,
        "location": signal.location,
        "camera_status": "ONLINE" if signal.status == "ACTIVE" else "OFFLINE",
        "vehicle_count": estimated_count,
        "congestion_level": congestion_level,
        "calculated_green_time": signal.green_time,
        "yellow_time": signal.yellow_time,
        "red_time": signal.red_time,
        "signal_status": signal.status
    }
