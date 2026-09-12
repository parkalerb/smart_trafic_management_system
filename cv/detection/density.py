from collections import deque


class TrafficDensityEngine:
    """
    Traffic Density & Congestion Engine.
    Evaluates current real-time traffic state based on active tracked vehicles in the scene.
    Applies moving-average temporal smoothing to prevent per-frame classification flickering.
    """

    TARGET_VEHICLE_CLASSES = {"car", "motorcycle", "bus", "truck"}

    def __init__(self, low_threshold=4.0, high_threshold=9.0, smoothing_window=5):
        """
        Initialize TrafficDensityEngine.
        :param low_threshold: Vehicle count boundary between LOW and MEDIUM density.
        :param high_threshold: Vehicle count boundary between MEDIUM and HIGH density.
        :param smoothing_window: Window size for moving-average smoothing across frames.
        """
        self.low_threshold = float(low_threshold)
        self.high_threshold = float(high_threshold)
        self.smoothing_window = max(1, int(smoothing_window))
        
        self.history = deque(maxlen=self.smoothing_window)

    def process_active_vehicles(self, tracked_vehicles):
        """
        Calculate density, congestion level, and class distribution for active tracked vehicles.
        :param tracked_vehicles: List of vehicle dicts from VehicleTracker.
        :return: Dict containing active_vehicle_count, smoothed_vehicle_count, density_level, congestion_level, and class_counts.
        """
        class_counts = {
            "car": 0,
            "motorcycle": 0,
            "bus": 0,
            "truck": 0
        }

        seen_track_ids = set()
        active_count = 0

        if tracked_vehicles:
            for vehicle in tracked_vehicles:
                if not isinstance(vehicle, dict):
                    continue

                track_id = vehicle.get("track_id")
                class_name = vehicle.get("class_name")

                # Ignore duplicate track IDs if present in same frame
                if track_id is not None and track_id in seen_track_ids:
                    continue

                # Filter for allowed target vehicle classes
                if class_name in self.TARGET_VEHICLE_CLASSES:
                    if track_id is not None:
                        seen_track_ids.add(track_id)
                    active_count += 1
                    class_counts[class_name] = class_counts.get(class_name, 0) + 1

        # Append current raw active count to rolling history
        self.history.append(active_count)

        # Calculate moving average smoothed count
        smoothed_count = round(sum(self.history) / len(self.history), 2)

        # Classify density level based on smoothed active vehicle count
        if smoothed_count <= self.low_threshold:
            density_level = "LOW"
            congestion_level = "LOW"
        elif smoothed_count <= self.high_threshold:
            density_level = "MEDIUM"
            congestion_level = "MODERATE"
        else:
            density_level = "HIGH"
            congestion_level = "HIGH"

        return {
            "active_vehicle_count": active_count,
            "smoothed_vehicle_count": smoothed_count,
            "density_level": density_level,
            "congestion_level": congestion_level,
            "class_counts": class_counts
        }

    def reset(self):
        """Reset temporal smoothing history buffer."""
        self.history.clear()
