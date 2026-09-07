from collections import defaultdict, deque
from ultralytics import YOLO


class VehicleTracker:
    """
    Multi-object vehicle tracker with persistent track IDs across frames using ByteTrack.
    Maintains motion history trails for active tracks.
    """

    # COCO Dataset Class IDs for Road Vehicles
    VEHICLE_CLASS_MAP = {
        2: "car",
        3: "motorcycle",
        5: "bus",
        7: "truck"
    }

    def __init__(self, model_path="yolov8n.pt", conf_threshold=0.25, tracker_type="bytetrack.yaml", trail_length=15):
        """
        Initialize VehicleTracker.
        :param model_path: Path or name of pretrained YOLO model weights.
        :param conf_threshold: Confidence threshold for filtering detections.
        :param tracker_type: Ultralytics tracking config (e.g., 'bytetrack.yaml' or 'botsort.yaml').
        :param trail_length: Maximum number of recent center points stored for motion trails.
        """
        self.model_path = model_path
        self.conf_threshold = conf_threshold
        self.tracker_type = tracker_type
        self.trail_length = trail_length
        self.model = YOLO(model_path)

        # Map track_id -> deque of recent (cx, cy) positions
        self.track_history = defaultdict(lambda: deque(maxlen=self.trail_length))

    def track(self, frame):
        """
        Perform vehicle detection and tracking on a single frame.
        :param frame: OpenCV BGR frame (numpy array).
        :return: List of dicts with tracked vehicle details (track_id, class_name, confidence, box, center, trail).
        """
        if frame is None or frame.size == 0:
            return []

        results = self.model.track(
            frame,
            persist=True,
            tracker=self.tracker_type,
            conf=self.conf_threshold,
            verbose=False
        )

        tracked_vehicles = []

        if results and len(results) > 0:
            boxes = results[0].boxes
            if boxes is not None and boxes.id is not None:
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id in self.VEHICLE_CLASS_MAP:
                        track_id = int(box.id[0].item())
                        conf = float(box.conf[0].item())
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                        class_name = self.VEHICLE_CLASS_MAP[cls_id]

                        # Update trail points
                        self.track_history[track_id].append((cx, cy))

                        tracked_vehicles.append({
                            "track_id": track_id,
                            "class_name": class_name,
                            "class_id": cls_id,
                            "confidence": conf,
                            "box": (x1, y1, x2, y2),
                            "center": (cx, cy),
                            "trail": list(self.track_history[track_id])
                        })

        return tracked_vehicles

    def reset_history(self):
        """Reset internal motion trail history."""
        self.track_history.clear()
