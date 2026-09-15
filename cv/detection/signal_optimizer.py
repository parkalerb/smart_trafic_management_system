class DynamicSignalOptimizer:
    """
    Dynamic Traffic Signal Optimization Engine.
    Calculates deterministic, explainable, and bounded traffic signal timing recommendations
    (green, yellow, and red light durations) based on real-time traffic state metrics.
    """

    def __init__(
        self,
        base_green=20,
        time_per_vehicle=3,
        min_green=20,
        max_green=60,
        yellow_time=5,
        min_red=20
    ):
        """
        Initialize DynamicSignalOptimizer.
        :param base_green: Base green signal allocation in seconds.
        :param time_per_vehicle: Additional green time in seconds per active vehicle.
        :param min_green: Minimum safe green signal duration in seconds (lower bound).
        :param max_green: Maximum safe green signal duration in seconds (upper bound).
        :param yellow_time: Fixed yellow signal duration in seconds.
        :param min_red: Minimum red signal duration in seconds.
        """
        self.base_green = max(0, int(base_green))
        self.time_per_vehicle = max(0, float(time_per_vehicle))
        self.min_green = max(1, int(min_green))
        self.max_green = max(self.min_green, int(max_green))
        self.yellow_time = max(1, int(yellow_time))
        self.min_red = max(1, int(min_red))

    def recommend_signal_timing(self, traffic_state):
        """
        Calculate traffic signal timing recommendation from current traffic state.
        :param traffic_state: Dict from TrafficDensityEngine containing active/smoothed counts & density levels.
        :return: Dict containing recommended_green_time, yellow_time, red_time, traffic_state, and reason.
        """
        if not isinstance(traffic_state, dict):
            traffic_state = {}

        # Prefer smoothed count if available; fallback to raw active count or 0
        raw_count = traffic_state.get("smoothed_vehicle_count")
        if raw_count is None:
            raw_count = traffic_state.get("active_vehicle_count", 0)

        # Defensively clamp vehicle count to non-negative numbers
        try:
            effective_count = max(0.0, float(raw_count))
        except (ValueError, TypeError):
            effective_count = 0.0

        # Preserve existing formula: green_time = base_green + (vehicle_count * time_per_vehicle)
        calculated_raw_green = self.base_green + (effective_count * self.time_per_vehicle)

        # Enforce strict safety bounds [min_green, max_green]
        recommended_green = max(self.min_green, min(self.max_green, int(round(calculated_raw_green))))

        # Calculate red time clearance allocation
        red_time = max(self.min_red, recommended_green - self.yellow_time)

        # Determine traffic state label
        traffic_state_label = traffic_state.get("congestion_level")
        if not traffic_state_label:
            traffic_state_label = traffic_state.get("density_level")

        if not traffic_state_label:
            if effective_count <= 4.0:
                traffic_state_label = "LOW"
            elif effective_count <= 9.0:
                traffic_state_label = "MODERATE"
            else:
                traffic_state_label = "HIGH"

        # Explainable, deterministic narrative reason
        if effective_count <= 4.0:
            reason = "Low traffic detected; minimum green time allocated for baseline clearance."
        elif effective_count <= 9.0:
            reason = "Moderate traffic detected; green time extended to serve vehicle load."
        else:
            reason = f"High traffic detected; maximum green time allocated within safety bounds ({self.max_green}s limit)."

        return {
            "recommended_green_time": recommended_green,
            "yellow_time": self.yellow_time,
            "red_time": red_time,
            "traffic_state": traffic_state_label,
            "reason": reason
        }
