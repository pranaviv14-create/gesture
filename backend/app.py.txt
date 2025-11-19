from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64, io
from PIL import Image
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load model
MODEL_PATH = "backend/model/mp_hand_gesture.h5"
GESTURE_NAMES = "backend/gesture.names"

model = load_model(MODEL_PATH)

# Load class names
with open(GESTURE_NAMES, "r") as f:
    classNames = [line.strip() for line in f.readlines() if line.strip()]

mp_hands = mp.solutions.hands

def normalize_landmarks(landmarks):
    landmarks = np.array(landmarks)
    x_min, y_min = np.min(landmarks[:, 0]), np.min(landmarks[:, 1])
    x_max, y_max = np.max(landmarks[:, 0]), np.max(landmarks[:, 1])

    width = x_max - x_min if x_max != x_min else 1
    height = y_max - y_min if y_max != y_min else 1

    normalized = (landmarks - [x_min, y_min]) / [width, height]
    return normalized.flatten().reshape(1, -1)

@app.route("/")
def home():
    return {"status": "ok", "model_loaded": True}

@app.route("/predict_image", methods=["POST"])
def predict_image():
    data = request.get_json()
    if "image" not in data:
        return {"error": "No image provided"}, 400

    b64 = data["image"].split(",")[-1]
    img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
    img_np = np.array(img)

    with mp_hands.Hands(static_image_mode=True, max_num_hands=1) as hands:
        result = hands.process(img_np)

        if not result.multi_hand_landmarks:
            return {"error": "No hand detected"}, 400

        hand = result.multi_hand_landmarks[0]
        landmarks = [[lm.x, lm.y] for lm in hand.landmark]

    # Normalize & predict
    x = normalize_landmarks(landmarks)
    prediction = model.predict(x, verbose=0)[0]

    classID = int(np.argmax(prediction))
    conf = float(np.max(prediction))
    label = classNames[classID]

    return {"label": label, "confidence": conf}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
