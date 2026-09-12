import unittest
import sys
import os

# Ensure project root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.detection.density import TrafficDensityEngine


class TestTrafficDensityEngine(unittest.TestCase):
    """
    Focused unit test suite for TrafficDensityEngine.
    """

    def setUp(self):
        # Default engine: LOW <= 4.0, MEDIUM 4.0 < x <= 9.0, HIGH > 9.0, window=5
        self.engine = TrafficDensityEngine(low_threshold=4.0, high_threshold=9.0, smoothing_window=5)

    def test_zero_active_vehicles(self):
        """Test behavior with zero active vehicles (empty scene)."""
        res = self.engine.process_active_vehicles([])
        self.assertEqual(res["active_vehicle_count"], 0)
        self.assertEqual(res["smoothed_vehicle_count"], 0.0)
        self.assertEqual(res["density_level"], "LOW")
        self.assertEqual(res["congestion_level"], "LOW")
        self.assertEqual(res["class_counts"], {"car": 0, "motorcycle": 0, "bus": 0, "truck": 0})

    def test_low_density(self):
        """Test LOW density classification with 2 vehicles."""
        vehicles = [
            {"track_id": 1, "class_name": "car"},
            {"track_id": 2, "class_name": "motorcycle"}
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 2)
        self.assertEqual(res["smoothed_vehicle_count"], 2.0)
        self.assertEqual(res["density_level"], "LOW")
        self.assertEqual(res["congestion_level"], "LOW")
        self.assertEqual(res["class_counts"]["car"], 1)
        self.assertEqual(res["class_counts"]["motorcycle"], 1)

    def test_medium_density(self):
        """Test MEDIUM density classification with 6 vehicles."""
        vehicles = [
            {"track_id": i, "class_name": "car"} for i in range(1, 7)
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 6)
        self.assertEqual(res["smoothed_vehicle_count"], 6.0)
        self.assertEqual(res["density_level"], "MEDIUM")
        self.assertEqual(res["congestion_level"], "MODERATE")

    def test_high_density(self):
        """Test HIGH density classification with 12 vehicles."""
        vehicles = [
            {"track_id": i, "class_name": "car"} for i in range(1, 13)
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 12)
        self.assertEqual(res["smoothed_vehicle_count"], 12.0)
        self.assertEqual(res["density_level"], "HIGH")
        self.assertEqual(res["congestion_level"], "HIGH")

    def test_class_wise_counting(self):
        """Test class-wise breakdown for all target vehicle classes."""
        vehicles = [
            {"track_id": 1, "class_name": "car"},
            {"track_id": 2, "class_name": "car"},
            {"track_id": 3, "class_name": "motorcycle"},
            {"track_id": 4, "class_name": "bus"},
            {"track_id": 5, "class_name": "truck"},
            {"track_id": 6, "class_name": "truck"}
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 6)
        self.assertEqual(res["class_counts"]["car"], 2)
        self.assertEqual(res["class_counts"]["motorcycle"], 1)
        self.assertEqual(res["class_counts"]["bus"], 1)
        self.assertEqual(res["class_counts"]["truck"], 2)

    def test_threshold_boundary_behavior(self):
        """Test exact boundary transitions for low_threshold=4.0 and high_threshold=9.0."""
        # 4 vehicles -> 4.0 -> LOW
        v4 = [{"track_id": i, "class_name": "car"} for i in range(1, 5)]
        r4 = self.engine.process_active_vehicles(v4)
        self.assertEqual(r4["density_level"], "LOW")
        self.assertEqual(r4["congestion_level"], "LOW")

        self.engine.reset()

        # 5 vehicles -> 5.0 -> MEDIUM
        v5 = [{"track_id": i, "class_name": "car"} for i in range(1, 6)]
        r5 = self.engine.process_active_vehicles(v5)
        self.assertEqual(r5["density_level"], "MEDIUM")
        self.assertEqual(r5["congestion_level"], "MODERATE")

        self.engine.reset()

        # 9 vehicles -> 9.0 -> MEDIUM
        v9 = [{"track_id": i, "class_name": "car"} for i in range(1, 10)]
        r9 = self.engine.process_active_vehicles(v9)
        self.assertEqual(r9["density_level"], "MEDIUM")
        self.assertEqual(r9["congestion_level"], "MODERATE")

        self.engine.reset()

        # 10 vehicles -> 10.0 -> HIGH
        v10 = [{"track_id": i, "class_name": "car"} for i in range(1, 11)]
        r10 = self.engine.process_active_vehicles(v10)
        self.assertEqual(r10["density_level"], "HIGH")
        self.assertEqual(r10["congestion_level"], "HIGH")

    def test_smoothing_behavior(self):
        """Test moving average calculation across frame sequence."""
        # Window size = 3
        engine = TrafficDensityEngine(low_threshold=4.0, high_threshold=9.0, smoothing_window=3)

        # Frame 1: 3 vehicles -> history = [3] -> smooth = 3.0
        r1 = engine.process_active_vehicles([{"track_id": i, "class_name": "car"} for i in range(1, 4)])
        self.assertEqual(r1["smoothed_vehicle_count"], 3.0)

        # Frame 2: 9 vehicles -> history = [3, 9] -> smooth = 6.0
        r2 = engine.process_active_vehicles([{"track_id": i, "class_name": "car"} for i in range(1, 10)])
        self.assertEqual(r2["smoothed_vehicle_count"], 6.0)

        # Frame 3: 6 vehicles -> history = [3, 9, 6] -> smooth = 6.0
        r3 = engine.process_active_vehicles([{"track_id": i, "class_name": "car"} for i in range(1, 7)])
        self.assertEqual(r3["smoothed_vehicle_count"], 6.0)

        # Frame 4: 6 vehicles -> history = [9, 6, 6] -> smooth = 7.0
        r4 = engine.process_active_vehicles([{"track_id": i, "class_name": "car"} for i in range(1, 7)])
        self.assertEqual(r4["smoothed_vehicle_count"], 7.0)

    def test_unknown_and_non_vehicle_classes_ignored(self):
        """Test that non-road vehicles (e.g. person, bicycle, dog) are ignored."""
        vehicles = [
            {"track_id": 1, "class_name": "car"},
            {"track_id": 2, "class_name": "person"},
            {"track_id": 3, "class_name": "bicycle"},
            {"track_id": 4, "class_name": "truck"},
            {"track_id": 5, "class_name": "dog"}
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 2)
        self.assertEqual(res["class_counts"]["car"], 1)
        self.assertEqual(res["class_counts"]["truck"], 1)
        self.assertNotIn("person", res["class_counts"])

    def test_duplicate_track_ids_deduplicated(self):
        """Test defensive deduplication if duplicate track IDs exist in active input."""
        vehicles = [
            {"track_id": 1, "class_name": "car"},
            {"track_id": 1, "class_name": "car"},  # duplicate ID 1
            {"track_id": 2, "class_name": "truck"}
        ]
        res = self.engine.process_active_vehicles(vehicles)
        self.assertEqual(res["active_vehicle_count"], 2)
        self.assertEqual(res["class_counts"]["car"], 1)
        self.assertEqual(res["class_counts"]["truck"], 1)

    def test_reset(self):
        """Test reset method clears smoothing history."""
        self.engine.process_active_vehicles([{"track_id": 1, "class_name": "car"} for _ in range(10)])
        self.assertEqual(len(self.engine.history), 1)
        self.engine.reset()
        self.assertEqual(len(self.engine.history), 0)


if __name__ == "__main__":
    unittest.main()
