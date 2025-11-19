import os
import io
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

MODEL_PATH = "backend/model/mp_hand_gesture.h5"  # if model in repo
MODEL_URL = os.environ.get("MODEL_URL")

# if using MODEL_URL, download it on startup (optional)
if MODEL_URL and not os.path.exists("backend/model/mp_hand_gesture.h5"):
    os.makedirs("backend/model", exist_ok=True)
    import requests
    r = requests.get(MODEL_URL, stream=True)
    with open("backend/model/mp_hand_gesture.h5", "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

model = load_model(MODEL_PATH)
with open("backend/gesture.names", "r") as f:
    classNames = [line.strip() for line in f.readlines() if line.strip()]

mp_hands = mp.solutions.hands

def normalize_landmarks(landmarks):
    landmarks = np.array(landmarks)
    x_min, y_min = np.min(landmarks[:, 0]), np.min(landmarks[:, 1])
    x_max, y_max = np.max(landmarks[:, 0]), np.max(landmarks[:, 1])
    width = x_max - x_min if x_max != x_min else 1.0
    height = y_max - y_min if y_max != y_min else 1.0
    normalized = (landmarks - [x_min, y_min]) / [width, height]
    return normalized.flatten().reshape(1, -1)

@app.route("/")
def home():
    return {"status": "ok", "model_loaded": True}

@app.route("/predict_image", methods=["POST"])
def predict_image():
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    # data["image"] expected "data:image/png;base64,...."
    b64 = data["image"].split(",")[-1]

    # decode base64 to bytes
    img_bytes = base64.b64decode(b64)

    # convert to numpy array then decode with OpenCV
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # BGR format

    if img is None:
        return jsonify({"error": "Could not decode image"}), 400

    # convert BGR -> RGB for mediapipe
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    with mp_hands.Hands(static_image_mode=True, max_num_hands=1) as hands:
        result = hands.process(img_rgb)

        if not result.multi_hand_landmarks:
            return jsonify({"error": "No hand detected"}), 400

        hand = result.multi_hand_landmarks[0]
        landmarks = [[lm.x, lm.y] for lm in hand.landmark]

    x = normalize_landmarks(landmarks)
    prediction = model.predict(x, verbose=0)[0]
    classID = int(np.argmax(prediction))
    conf = float(np.max(prediction))
    label = classNames[classID]

    return jsonify({"label": label, "confidence": conf})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
