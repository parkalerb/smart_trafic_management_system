class VehicleCounter:
    """
    Virtual line-crossing vehicle counter.
    Tracks unique vehicles crossing a virtual horizontal counting line and maintains total & class-wise counts.
    Ensures each unique track ID is counted at most ONCE per video run.
    """

    def __init__(self, line_ratio=0.85):
        """
        Initialize VehicleCounter.
        :param line_ratio: Y coordinate ratio relative to frame height (0.0 to 1.0) for virtual line location.
        """
        self.line_ratio = line_ratio
        self.counted_ids = set()
        self.class_counts = {
            "car": 0,
            "motorcycle": 0,
            "bus": 0,
            "truck": 0
        }
        self.total_count = 0
        self.last_positions = {}  # Map track_id -> previous cy coordinate

    def update(self, tracked_vehicles, frame_height):
        """
        Process current frame's tracked vehicles and update counts if line crossing occurs.
        :param tracked_vehicles: List of tracked vehicle dicts from VehicleTracker.
        :param frame_height: Height of video frame in pixels.
        :return: Tuple (newly_counted_vehicles_list, line_y_integer)
        """
        line_y = int(frame_height * self.line_ratio)
        newly_counted = []

        for vehicle in tracked_vehicles:
            track_id = vehicle["track_id"]
            class_name = vehicle["class_name"]
            _, cy = vehicle["center"]

            if track_id in self.last_positions:
                prev_cy = self.last_positions[track_id]

                # Line crossing check: moving top->bottom OR bottom->top across line_y
                crossed_down = (prev_cy < line_y <= cy)
                crossed_up = (prev_cy > line_y >= cy)

                if (crossed_down or crossed_up) and (track_id not in self.counted_ids):
                    self.counted_ids.add(track_id)
                    self.total_count += 1
                    self.class_counts[class_name] = self.class_counts.get(class_name, 0) + 1
                    newly_counted.append(vehicle)

            # Update position tracking
            self.last_positions[track_id] = cy

        return newly_counted, line_y

    def get_counts(self):
        """
        Get current count summary.
        :return: Dict containing total_vehicles, class_counts dict, and unique_counted_ids count.
        """
        return {
            "total_vehicles": self.total_count,
            "class_counts": dict(self.class_counts),
            "unique_counted_ids": len(self.counted_ids)
        }

    def reset(self):
        """Reset all counters and tracked vehicle position records."""
        self.counted_ids.clear()
        self.last_positions.clear()
        self.class_counts = {k: 0 for k in self.class_counts}
        self.total_count = 0
