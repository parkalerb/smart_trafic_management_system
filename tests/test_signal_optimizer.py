import unittest
import sys
import os

# Ensure project root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.detection.density import TrafficDensityEngine
from cv.detection.signal_optimizer import DynamicSignalOptimizer


class TestDynamicSignalOptimizer(unittest.TestCase):
    """
    Focused unit & integration test suite for DynamicSignalOptimizer.
    """

    def setUp(self):
        # Default optimizer: base_green=20, time_per_vehicle=3, min_green=20, max_green=60, yellow=5, min_red=20
        self.optimizer = DynamicSignalOptimizer(
            base_green=20,
            time_per_vehicle=3,
            min_green=20,
            max_green=60,
            yellow_time=5,
            min_red=20
        )

    def test_zero_active_vehicles(self):
        """1. Zero active vehicles returns min_green (20s)."""
        state = {"smoothed_vehicle_count": 0.0, "active_vehicle_count": 0, "density_level": "LOW", "congestion_level": "LOW"}
        res = self.optimizer.recommend_signal_timing(state)
        self.assertEqual(res["recommended_green_time"], 20)
        self.assertEqual(res["yellow_time"], 5)
        self.assertEqual(res["red_time"], 20)
        self.assertEqual(res["traffic_state"], "LOW")
        self.assertIn("Low traffic", res["reason"])

    def test_low_traffic(self):
        """2. LOW traffic (2 vehicles): 20 + 2*3 = 26s."""
        state = {"smoothed_vehicle_count": 2.0, "active_vehicle_count": 2, "density_level": "LOW", "congestion_level": "LOW"}
        res = self.optimizer.recommend_signal_timing(state)
        self.assertEqual(res["recommended_green_time"], 26)
        self.assertEqual(res["yellow_time"], 5)
        self.assertEqual(res["red_time"], 21)  # max(20, 26 - 5)
        self.assertEqual(res["traffic_state"], "LOW")
        self.assertIn("Low traffic", res["reason"])

    def test_medium_traffic(self):
        """3. MEDIUM traffic (6 vehicles): 20 + 6*3 = 38s."""
        state = {"smoothed_vehicle_count": 6.0, "active_vehicle_count": 6, "density_level": "MEDIUM", "congestion_level": "MODERATE"}
        res = self.optimizer.recommend_signal_timing(state)
        self.assertEqual(res["recommended_green_time"], 38)
        self.assertEqual(res["yellow_time"], 5)
        self.assertEqual(res["red_time"], 33)  # max(20, 38 - 5)
        self.assertEqual(res["traffic_state"], "MODERATE")
        self.assertIn("Moderate traffic", res["reason"])

    def test_high_traffic(self):
        """4. HIGH traffic (12 vehicles): 20 + 12*3 = 56s."""
        state = {"smoothed_vehicle_count": 12.0, "active_vehicle_count": 12, "density_level": "HIGH", "congestion_level": "HIGH"}
        res = self.optimizer.recommend_signal_timing(state)
        self.assertEqual(res["recommended_green_time"], 56)
        self.assertEqual(res["yellow_time"], 5)
        self.assertEqual(res["red_time"], 51)  # max(20, 56 - 5)
        self.assertEqual(res["traffic_state"], "HIGH")
        self.assertIn("High traffic", res["reason"])

    def test_min_green_boundary(self):
        """5. Minimum green boundary enforcement."""
        optimizer = DynamicSignalOptimizer(base_green=10, min_green=20, max_green=60)
        # 0 vehicles: 10 + 0 = 10 -> bounded to min_green 20
        res = optimizer.recommend_signal_timing({"smoothed_vehicle_count": 0})
        self.assertEqual(res["recommended_green_time"], 20)

    def test_max_green_boundary(self):
        """6. Maximum green boundary enforcement."""
        optimizer = DynamicSignalOptimizer(base_green=20, time_per_vehicle=3, min_green=20, max_green=60)
        # 15 vehicles: 20 + 15*3 = 65 -> bounded to max_green 60
        res = optimizer.recommend_signal_timing({"smoothed_vehicle_count": 15.0, "congestion_level": "HIGH"})
        self.assertEqual(res["recommended_green_time"], 60)
        self.assertIn("60s limit", res["reason"])

    def test_very_large_vehicle_count(self):
        """7. Very large vehicle count (100 vehicles) safely capped at max_green."""
        res = self.optimizer.recommend_signal_timing({"smoothed_vehicle_count": 100.0})
        self.assertEqual(res["recommended_green_time"], 60)
        self.assertGreaterEqual(res["recommended_green_time"], self.optimizer.min_green)
        self.assertLessEqual(res["recommended_green_time"], self.optimizer.max_green)

    def test_invalid_negative_vehicle_count(self):
        """8. Invalid/negative vehicle count handled gracefully without crashes or negative green."""
        res_neg = self.optimizer.recommend_signal_timing({"smoothed_vehicle_count": -10.0})
        self.assertEqual(res_neg["recommended_green_time"], 20)

        res_str = self.optimizer.recommend_signal_timing({"smoothed_vehicle_count": "invalid"})
        self.assertEqual(res_str["recommended_green_time"], 20)

    def test_missing_optional_traffic_fields(self):
        """9. Missing optional traffic fields (empty input dict or None)."""
        res_empty = self.optimizer.recommend_signal_timing({})
        self.assertEqual(res_empty["recommended_green_time"], 20)
        self.assertEqual(res_empty["traffic_state"], "LOW")

        res_none = self.optimizer.recommend_signal_timing(None)
        self.assertEqual(res_none["recommended_green_time"], 20)

    def test_deterministic_recommendation(self):
        """10. Deterministic output given identical traffic states."""
        state = {"smoothed_vehicle_count": 5.0, "congestion_level": "MODERATE"}
        res1 = self.optimizer.recommend_signal_timing(state)
        res2 = self.optimizer.recommend_signal_timing(state)
        self.assertEqual(res1, res2)

    def test_yellow_time_validity(self):
        """11. Yellow time is positive and fixed as configured."""
        res = self.optimizer.recommend_signal_timing({"smoothed_vehicle_count": 3.0})
        self.assertGreater(res["yellow_time"], 0)
        self.assertEqual(res["yellow_time"], 5)

    def test_red_time_validity(self):
        """12. Red time is valid and enforces min_red."""
        res = self.optimizer.recommend_signal_timing({"smoothed_vehicle_count": 0.0})
        self.assertGreaterEqual(res["red_time"], self.optimizer.min_red)

    def test_integration_density_to_signal_optimizer(self):
        """13. Integration Test: TrafficDensityEngine output -> DynamicSignalOptimizer recommendation."""
        density_engine = TrafficDensityEngine(low_threshold=4.0, high_threshold=9.0, smoothing_window=3)
        
        # Simulate sequence of tracked vehicles across frames
        tracked_f1 = [{"track_id": 1, "class_name": "car"}, {"track_id": 2, "class_name": "truck"}]
        state_f1 = density_engine.process_active_vehicles(tracked_f1)
        rec_f1 = self.optimizer.recommend_signal_timing(state_f1)

        self.assertEqual(state_f1["active_vehicle_count"], 2)
        self.assertEqual(rec_f1["recommended_green_time"], 26)  # 20 + 2*3 = 26
        self.assertEqual(rec_f1["traffic_state"], "LOW")

        # Frame with 6 vehicles
        tracked_f2 = [{"track_id": i, "class_name": "car"} for i in range(1, 7)]
        state_f2 = density_engine.process_active_vehicles(tracked_f2)
        rec_f2 = self.optimizer.recommend_signal_timing(state_f2)

        # Smoothed count across [2, 6] = 4.0
        self.assertEqual(state_f2["smoothed_vehicle_count"], 4.0)
        self.assertEqual(rec_f2["recommended_green_time"], 32)  # 20 + 4*3 = 32


if __name__ == "__main__":
    unittest.main()
