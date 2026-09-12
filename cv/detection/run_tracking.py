import cv2
import time
import os
import sys
import argparse
import numpy as np

# Ensure project root directory is in sys.path for clean import resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from cv.detection.tracker import VehicleTracker
from cv.detection.counter import VehicleCounter
from cv.detection.density import TrafficDensityEngine


def process_video_tracking(
    video_path,
    model_path="yolov8n.pt",
    conf_threshold=0.25,
    line_ratio=0.85,
    tracker_type="bytetrack.yaml",
    density_low=4.0,
    density_high=9.0,
    smoothing_window=5,
    display=True,
    max_frames=None,
    start_frame=0,
    output_path=None
):

    """
    Process input video stream frame-by-frame with multi-object vehicle tracking & persistent line-crossing counting.
    Renders bounding boxes, track IDs, motion trails, virtual counting line, and HUD metrics.
    """
    if not os.path.exists(video_path):
        print(f"[ERROR] Video file not found at: {video_path}")
        return False

    print(f"[INFO] Opening video source: {video_path}")
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print(f"[ERROR] Failed to open video source: {video_path}")
        return False

    res_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    res_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print(f"[INFO] Video Info: Resolution = {res_width}x{res_height} | Native FPS = {video_fps:.1f} | Total Frames = {total_frames}")

    if start_frame > 0:
        print(f"[INFO] Seeking to frame {start_frame}...")
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    print(f"[INFO] Initializing VehicleTracker (model='{model_path}', conf={conf_threshold}, tracker='{tracker_type}')...")
    tracker = VehicleTracker(model_path=model_path, conf_threshold=conf_threshold, tracker_type=tracker_type)
    print(f"[INFO] Initializing VehicleCounter (line_ratio={line_ratio:.2f})...")
    counter = VehicleCounter(line_ratio=line_ratio)
    print(f"[INFO] Initializing TrafficDensityEngine (low={density_low}, high={density_high}, window={smoothing_window})...")
    density_engine = TrafficDensityEngine(low_threshold=density_low, high_threshold=density_high, smoothing_window=smoothing_window)

    writer = None
    if output_path:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_path, fourcc, video_fps if video_fps > 0 else 30.0, (res_width, res_height))
        print(f"[INFO] Saving output video to: {output_path}")

    # Bounding Box & Trail Color Scheme for Vehicle Classes (BGR)
    COLOR_MAP = {
        "car": (0, 255, 0),          # Bright Green
        "motorcycle": (255, 165, 0),  # Cyan / Light Blue
        "bus": (0, 165, 255),        # Orange
        "truck": (0, 0, 255)         # Red
    }

    CONGESTION_COLOR_MAP = {
        "LOW": (0, 255, 0),          # Green
        "MODERATE": (0, 215, 255),   # Gold / Yellow
        "HIGH": (0, 0, 255)          # Red
    }

    processed_count = 0
    start_time = time.time()
    prev_frame_time = time.time()
    last_density_state = None

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame is None:
                print("[INFO] End of video stream reached.")
                break

            current_frame_idx = start_frame + processed_count
            processed_count += 1
            current_time = time.time()

            # Perform vehicle tracking
            tracked_vehicles = tracker.track(frame)

            # Update line crossing vehicle counter
            newly_counted, line_y = counter.update(tracked_vehicles, res_height)

            # Calculate current traffic density & congestion state
            last_density_state = density_engine.process_active_vehicles(tracked_vehicles)

            # 1. Draw Virtual Counting Line
            cv2.line(frame, (0, line_y), (res_width, line_y), (0, 255, 255), 2)
            cv2.putText(
                frame,
                f"COUNTING LINE (Y={line_y})",
                (15, line_y - 8),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 255),
                1,
                cv2.LINE_AA
            )

            # 2. Draw Tracked Vehicles (Motion Trails, BBoxes, Track IDs)
            for veh in tracked_vehicles:
                t_id = veh["track_id"]
                cname = veh["class_name"]
                conf = veh["confidence"]
                x1, y1, x2, y2 = veh["box"]
                cx, cy = veh["center"]
                trail = veh["trail"]

                color = COLOR_MAP.get(cname, (255, 255, 255))
                is_counted = t_id in counter.counted_ids

                # Draw Motion Trail
                if len(trail) > 1:
                    points = np.array(trail, dtype=np.int32).reshape((-1, 1, 2))
                    cv2.polylines(frame, [points], isClosed=False, color=color, thickness=2)

                # Draw Bounding Box (Thicker if already counted)
                box_thickness = 3 if is_counted else 2
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, box_thickness)

                # Draw Center Point
                cv2.circle(frame, (cx, cy), 4, (0, 255, 255), -1)

                # Draw Label (Class | ID | Conf)
                status_symbol = " [OK]" if is_counted else ""
                label = f"{cname} | ID:{t_id} | {conf:.2f}{status_symbol}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                lbl_w, lbl_h = label_size

                cv2.rectangle(frame, (x1, y1 - lbl_h - 6), (x1 + lbl_w + 6, y1), color, -1)
                cv2.putText(frame, label, (x1 + 3, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1, cv2.LINE_AA)

            # Calculate Processing FPS
            fps = 1.0 / (current_time - prev_frame_time) if (current_time - prev_frame_time) > 0 else 0
            prev_frame_time = current_time

            # 3. Render HUD (Heads-Up Display)
            counts_info = counter.get_counts()
            total_counted = counts_info["total_vehicles"]

            active_cnt = last_density_state["active_vehicle_count"]
            smoothed_cnt = last_density_state["smoothed_vehicle_count"]
            density_lvl = last_density_state["density_level"]
            congestion_lvl = last_density_state["congestion_level"]
            active_cls = last_density_state["class_counts"]

            cong_color = CONGESTION_COLOR_MAP.get(congestion_lvl, (255, 255, 255))

            hud_bg = (20, 20, 20)
            cv2.rectangle(frame, (10, 10), (410, 160), hud_bg, -1)
            cv2.rectangle(frame, (10, 10), (410, 160), (0, 255, 255), 1)

            cv2.putText(frame, "TRAFFIC DENSITY & TRACKING HUD", (20, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"FPS: {fps:.1f} | Frame: {current_frame_idx}/{total_frames}", (20, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"ACTIVE VEHICLES: {active_cnt} (Smooth: {smoothed_cnt:.1f})", (20, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"TOTAL UNIQUE VEHICLES: {total_counted}", (20, 88), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 1, cv2.LINE_AA)
            cv2.putText(frame, f"DENSITY: {density_lvl} | CONGESTION: {congestion_lvl}", (20, 112), cv2.FONT_HERSHEY_SIMPLEX, 0.5, cong_color, 2, cv2.LINE_AA)
            
            cls_str = f"Active: Car:{active_cls['car']} | Trk:{active_cls['truck']} | Bus:{active_cls['bus']} | Moto:{active_cls['motorcycle']}"
            cv2.putText(frame, cls_str, (20, 138), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1, cv2.LINE_AA)

            if writer:
                writer.write(frame)

            if display:
                cv2.imshow("Smart Traffic Management System - Vehicle Tracking & Counting", frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("[INFO] User pressed 'q'. Exiting tracking pipeline...")
                    break

            if max_frames and processed_count >= max_frames:
                print(f"[INFO] Reached max_frames limit ({max_frames}). Stopping run.")
                break

    finally:
        total_time = time.time() - start_time
        avg_fps = processed_count / total_time if total_time > 0 else 0

        cap.release()
        if writer:
            writer.release()
        if display:
            cv2.destroyAllWindows()

        final_counts = counter.get_counts()
        print(f"\n=== VEHICLE TRACKING & DENSITY SUMMARY ===")
        print(f"Total Frames Processed : {processed_count}")
        print(f"Total Elapsed Time     : {total_time:.2f} seconds")
        print(f"Average Processing FPS : {avg_fps:.1f}")
        print(f"Total Unique Vehicles  : {final_counts['total_vehicles']}")
        if last_density_state:
            print(f"Final Active Vehicles  : {last_density_state['active_vehicle_count']} (Smoothed: {last_density_state['smoothed_vehicle_count']})")
            print(f"Final Density Level    : {last_density_state['density_level']}")
            print(f"Final Congestion Level : {last_density_state['congestion_level']}")
            print(f"Final Active Classes   : {last_density_state['class_counts']}")
        print(f"Cumulative Class Count : {final_counts['class_counts']}")

    return True



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-Time Vehicle Tracking & Unique Line-Crossing Counter")
    parser.add_argument(
        "--video",
        type=str,
        default=os.path.join("cv", "datasets", "traffic_videos", "traffic_test_01.mp4"),
        help="Path to input traffic video file"
    )
    parser.add_argument(
        "--model",
        type=str,
        default="yolov8n.pt",
        help="Path or name of YOLO model"
    )
    parser.add_argument(
        "--conf",
        type=float,
        default=0.25,
        help="Confidence threshold for vehicle detection"
    )
    parser.add_argument(
        "--line-ratio",
        type=float,
        default=0.85,
        help="Y ratio (0.0 - 1.0) for virtual counting line"
    )
    parser.add_argument(
        "--tracker",
        type=str,
        default="bytetrack.yaml",
        help="Tracker configuration file (e.g. bytetrack.yaml or botsort.yaml)"
    )
    parser.add_argument(
        "--start-frame",
        type=int,
        default=0,
        help="Frame index to start processing from"
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=None,
        help="Maximum frames to process"
    )
    parser.add_argument(
        "--density-low",
        type=float,
        default=4.0,
        help="Vehicle count threshold for LOW density classification"
    )
    parser.add_argument(
        "--density-high",
        type=float,
        default=9.0,
        help="Vehicle count threshold for HIGH density classification"
    )
    parser.add_argument(
        "--smoothing-window",
        type=int,
        default=5,
        help="Window size for moving-average density smoothing"
    )
    parser.add_argument(
        "--no-display",
        action="store_true",
        help="Disable GUI display window (headless mode)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Path to save annotated video output"
    )

    args = parser.parse_args()
    process_video_tracking(
        video_path=args.video,
        model_path=args.model,
        conf_threshold=args.conf,
        line_ratio=args.line_ratio,
        tracker_type=args.tracker,
        density_low=args.density_low,
        density_high=args.density_high,
        smoothing_window=args.smoothing_window,
        display=not args.no_display,
        max_frames=args.max_frames,
        start_frame=args.start_frame,
        output_path=args.output
    )

