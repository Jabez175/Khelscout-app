# fitness.py
from flask import Flask, render_template, Response, request, jsonify, redirect, url_for
import cv2
import mediapipe as mp
import numpy as np
import threading
import time
import csv
from datetime import datetime
import pyttsx3
import math
import pandas as pd
import os

app = Flask(__name__, static_url_path='/static')

# --- Voice setup (AI Coach voice) ---
engine = pyttsx3.init()
engine.setProperty("rate", 160)
engine.setProperty("volume", 1.0)
def speak(text):
    threading.Thread(target=lambda: engine.say(text) or engine.runAndWait()).start()

# --- MediaPipe setup ---
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose_detector = mp_pose.Pose(static_image_mode=False, model_complexity=1, min_detection_confidence=0.5)

# --- Camera ---
cap = cv2.VideoCapture(0)

# --- CSV file ---
CSV_FILE = "workout_history.csv"
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["DateTime", "Gender", "Exercise", "Reps", "DurationSec"])

# --- Averages Table ---
AVERAGES = {
    "pushups": {
        "male": {"normal": 25, "athlete": 60},
        "female": {"normal": 15, "athlete": 45}
    },
    "squats": {
        "male": {"normal": 40, "athlete": 100},
        "female": {"normal": 40, "athlete": 100}
    },
    "crunches": {
        "male": {"normal": 30, "athlete": 70},
        "female": {"normal": 30, "athlete": 70}
    }
}

# --- Utility: angle between 3 points ---
def angle_between(a, b, c):
    a = np.array(a); b = np.array(b); c = np.array(c)
    ba = a - b
    bc = c - b
    denom = (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-8)
    cosang = np.dot(ba, bc) / denom
    cosang = np.clip(cosang, -1.0, 1.0)
    return math.degrees(math.acos(cosang))

# --- Repetition Counter ---
class RepetitionCounter:
    def __init__(self, up_thresh, down_thresh, angle_getter):
        self.up_thresh = up_thresh
        self.down_thresh = down_thresh
        self.angle_getter = angle_getter
        self.state = "up"
        self.count = 0

    def step(self, landmarks, w, h):
        ang = self.angle_getter(landmarks, w, h)
        if ang is None:
            return None
        if self.state == "up" and ang <= self.down_thresh:
            self.state = "down"
        elif self.state == "down" and ang >= self.up_thresh:
            self.count += 1
            self.state = "up"
        return ang

# --- Angle getters ---
def get_elbow_angle(landmarks, w, h, side="right"):
    try:
        if side == "right":
            s = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            e = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
            r = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
        else:
            s = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            e = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
            r = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
        a = (s.x * w, s.y * h)
        b = (e.x * w, e.y * h)
        c = (r.x * w, r.y * h)
        return angle_between(a, b, c)
    except:
        return None

def get_knee_angle(landmarks, w, h, side="right"):
    try:
        if side == "right":
            hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
            knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
            ank = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        else:
            hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
            knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
            ank = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
        a = (hip.x * w, hip.y * h)
        b = (knee.x * w, knee.y * h)
        c = (ank.x * w, ank.y * h)
        return angle_between(a, b, c)
    except:
        return None

def get_torso_angle_for_crunch(landmarks, w, h):
    try:
        hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
        sh = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        nose = landmarks[mp_pose.PoseLandmark.NOSE.value]
        a = (hip.x * w, hip.y * h)
        b = (sh.x * w, sh.y * h)
        c = (nose.x * w, nose.y * h)
        return angle_between(a, b, c)
    except:
        return None

# --- Global Test State ---
test_state = {
    "active": False,
    "exercise": None,
    "gender": None,
    "start_time": None,
    "duration": 60,
    "last_result": None
}

# --- Counters ---
push_counter = RepetitionCounter(160, 90, lambda lm,w,h: get_elbow_angle(lm,w,h,"right"))
squat_counter = RepetitionCounter(160, 100, lambda lm,w,h: get_knee_angle(lm,w,h,"right"))
crunch_counter = RepetitionCounter(150, 100, lambda lm,w,h: get_torso_angle_for_crunch(lm,w,h))

def reset_counters():
    global push_counter, squat_counter, crunch_counter
    push_counter = RepetitionCounter(160, 90, lambda lm,w,h: get_elbow_angle(lm,w,h,"right"))
    squat_counter = RepetitionCounter(160, 100, lambda lm,w,h: get_knee_angle(lm,w,h,"right"))
    crunch_counter = RepetitionCounter(150, 100, lambda lm,w,h: get_torso_angle_for_crunch(lm,w,h))

# --- Start Test ---
@app.route("/start_test", methods=["POST"])
def start_test():
    data = request.json
    gender = data.get("gender")
    exercise = data.get("exercise")  # "pushups", "squats", "crunches"
    duration = int(data.get("duration", 60))
    if gender not in ("male","female") or exercise not in ("pushups","squats","crunches"):
        return jsonify({"ok": False, "error": "invalid params"}), 400

    reset_counters()
    test_state["active"] = True
    test_state["exercise"] = exercise
    test_state["gender"] = gender
    test_state["start_time"] = time.time()
    test_state["duration"] = duration
    test_state["last_result"] = None
    speak(f"{exercise.capitalize()} test started. Go!")
    return jsonify({"ok": True})

# --- Video Feed ---
def gen_frames():
    last_three_announced = set()
    while True:
        success, frame = cap.read()
        if not success:
            time.sleep(0.05)
            continue
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose_detector.process(rgb)
        img = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

        feedback_text = ""
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            if test_state["active"]:
                elapsed = time.time() - test_state["start_time"]
                remaining = int(test_state["duration"] - elapsed)

                if 0 < remaining <= 3:
                    if remaining not in last_three_announced:
                        speak(str(remaining))
                        last_three_announced.add(remaining)

                if remaining <= 0:
                    test_state["active"] = False
                    push = push_counter.count
                    squ = squat_counter.count
                    cru = crunch_counter.count
                    ex = test_state["exercise"]
                    reps = {"pushups": push, "squats": squ, "crunches": cru}[ex]

                    with open(CSV_FILE, "a", newline="") as f:
                        writer = csv.writer(f)
                        writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), test_state["gender"], ex, reps, test_state["duration"]])

                    avgs = AVERAGES.get(ex, {}).get(test_state["gender"], {"normal": None, "athlete": None})
                    test_state["last_result"] = {"exercise": ex, "gender": test_state["gender"], "reps": reps, "duration": test_state["duration"], "averages": avgs}
                    speak("Stop! Time's up")
                else:
                    ex = test_state["exercise"]
                    if ex == "pushups":
                        push_counter.step(lm, w, h)
                    elif ex == "squats":
                        squat_counter.step(lm, w, h)
                    elif ex == "crunches":
                        crunch_counter.step(lm, w, h)
                    counts = {"pushups": push_counter.count, "squats": squat_counter.count, "crunches": crunch_counter.count}
                    feedback_text = f"Time: {remaining}s | Push: {counts['pushups']} Squat: {counts['squats']} Crunch: {counts['crunches']}"

        cv2.rectangle(img, (5,5), (480,40), (0,0,0), -1)
        cv2.putText(img, feedback_text, (10,28), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
        ret, buffer = cv2.imencode('.jpg', img)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

# --- Results ---
@app.route("/results")
def results():
    res = test_state.get("last_result")
    if not res:
        return redirect(url_for("index"))
    avgs = res["averages"]
    return render_template("results.html", result=res, normal=avgs["normal"], athlete=avgs["athlete"])

# --- Index ---
@app.route("/")
def index():
    return render_template("index.html")

# --- Workout ---
@app.route("/workout")
def workout():
    return render_template("workout.html")

# --- Dashboard ---
@app.route("/dashboard")
def dashboard():
    df = pd.read_csv(CSV_FILE)
    rows = df.tail(30).to_dict(orient="records")
    return render_template("dashboard.html", rows=rows)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
