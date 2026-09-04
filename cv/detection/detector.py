from ultralytics import YOLO

class VehicleDetector:
    """
    Decoupled vehicle detector using a pretrained YOLO model.
    Accepts an input image frame and returns bounding boxes and labels for vehicle classes.
    """

    # COCO Dataset Class IDs for Road Vehicles
    VEHICLE_CLASS_MAP = {
        2: "car",
        3: "motorcycle",
        5: "bus",
        7: "truck"
    }

    def __init__(self, model_path="yolov8n.pt", conf_threshold=0.5):
        """
        Initialize YOLO vehicle detector.
        :param model_path: Pretrained YOLO model file path or identifier.
        :param conf_threshold: Confidence threshold for filtering detections.
        """
        self.model_path = model_path
        self.conf_threshold = conf_threshold
        self.model = YOLO(model_path)

    def detect(self, frame):
        """
        Perform object detection on a single frame.
        :param frame: OpenCV frame (numpy BGR image array).
        :return: List of dicts containing vehicle class_name, confidence, and bounding box coordinates (x1, y1, x2, y2).
        """
        if frame is None or frame.size == 0:
            return []

        results = self.model(frame, verbose=False)
        detections = []

        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            for box in boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())

                # Filter by confidence threshold and target vehicle classes
                if conf >= self.conf_threshold and cls_id in self.VEHICLE_CLASS_MAP:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    class_name = self.VEHICLE_CLASS_MAP[cls_id]

                    detections.append({
                        "class_name": class_name,
                        "confidence": conf,
                        "box": (x1, y1, x2, y2)
                    })

        return detections
