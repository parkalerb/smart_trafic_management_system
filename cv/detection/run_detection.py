import cv2
import time
import os
import sys
import argparse

# Ensure project root directory is in sys.path for clean import resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from cv.detection.detector import VehicleDetector


def process_video_stream(video_path, model_path="yolov8n.pt", conf_threshold=0.5, display=True, max_frames=None):
    """
    Process input video stream frame-by-frame, detect vehicles using VehicleDetector,
    draw bounding boxes and runtime metrics, and render display window.
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

    print(f"[INFO] Initializing VehicleDetector (model='{model_path}', conf_threshold={conf_threshold})...")
    detector = VehicleDetector(model_path=model_path, conf_threshold=conf_threshold)
    print("[INFO] Detector initialized successfully.\n")

    frame_count = 0
    start_time = time.time()
    prev_frame_time = time.time()

    # Bounding Box Color Scheme for Vehicle Classes (BGR)
    COLOR_MAP = {
        "car": (0, 255, 0),          # Green
        "motorcycle": (255, 165, 0),  # Cyan/Blue-Orange
        "bus": (0, 165, 255),        # Orange
        "truck": (0, 0, 255)         # Red
    }

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame is None:
                print("[INFO] End of video stream reached.")
                break

            frame_count += 1
            current_time = time.time()

            # Run Vehicle Detector on current frame
            detections = detector.detect(frame)

            # Draw Detections
            for det in detections:
                class_name = det["class_name"]
                conf = det["confidence"]
                x1, y1, x2, y2 = det["box"]

                color = COLOR_MAP.get(class_name, (255, 255, 255))

                # Draw Bounding Box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

                # Draw Class Name & Confidence Label
                label = f"{class_name} {conf:.2f}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                lbl_w, lbl_h = label_size

                cv2.rectangle(frame, (x1, y1 - lbl_h - 6), (x1 + lbl_w + 4, y1), color, -1)
                cv2.putText(frame, label, (x1 + 2, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

            # Calculate Processing FPS
            fps = 1.0 / (current_time - prev_frame_time) if (current_time - prev_frame_time) > 0 else 0
            prev_frame_time = current_time

            # Overlay Runtime Metrics On Screen
            metrics_bg = (20, 20, 20)
            cv2.rectangle(frame, (10, 10), (320, 100), metrics_bg, -1)
            cv2.rectangle(frame, (10, 10), (320, 100), (0, 255, 0), 1)

            cv2.putText(frame, f"Resolution: {res_width}x{res_height}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"Frame: {frame_count}/{total_frames}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"Processing FPS: {fps:.1f}", (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"Detections in Frame: {len(detections)}", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255) if len(detections)==0 else (0, 255, 0), 1, cv2.LINE_AA)

            if display:
                cv2.imshow("Smart Traffic Management System - Real-Time Vehicle Detection", frame)
                # Press 'q' to exit cleanly
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("[INFO] User pressed 'q'. Exiting detection pipeline...")
                    break

            if max_frames and frame_count >= max_frames:
                print(f"[INFO] Reached max_frames limit ({max_frames}). Stopping test run.")
                break

    finally:
        total_time = time.time() - start_time
        avg_fps = frame_count / total_time if total_time > 0 else 0

        cap.release()
        if display:
            cv2.destroyAllWindows()

        print(f"\n=== DETECTION PIPELINE SUMMARY ===")
        print(f"Total Frames Processed : {frame_count}")
        print(f"Total Elapsed Time     : {total_time:.2f} seconds")
        print(f"Average Processing FPS : {avg_fps:.1f}")

    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-Time Vehicle Detection Pipeline")
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
        default=0.5,
        help="Confidence threshold for vehicle detection"
    )
    parser.add_argument(
        "--no-display",
        action="store_true",
        help="Disable GUI display window (headless mode)"
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=None,
        help="Maximum frames to process (useful for automated testing)"
    )

    args = parser.parse_args()
    process_video_stream(
        video_path=args.video,
        model_path=args.model,
        conf_threshold=args.conf,
        display=not args.no_display,
        max_frames=args.max_frames
    )
