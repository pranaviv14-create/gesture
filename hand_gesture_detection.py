import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
from collections import deque, Counter
import os

# Paths
MODEL_PATH = "mp_hand_gesture.h5"
CLASS_NAMES_PATH = "gesture.names"
SIGN_PATH = "signs"

# Load model
model = load_model(MODEL_PATH)

# Load gesture names
with open(CLASS_NAMES_PATH, "r") as f:
    classNames = [line.strip() for line in f.readlines() if line.strip()]

# Load sign images (optional)
signs = {}
for cls in classNames:
    for ext in ['.png', '.jpg']:
        path = os.path.join(SIGN_PATH, cls + ext)
        if os.path.exists(path):
            signs[cls] = cv2.imread(path)
            break

# Mediapipe hands
mpHands = mp.solutions.hands
hands = mpHands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mpDraw = mp.solutions.drawing_utils

# Webcam
cap = cv2.VideoCapture(0)

# Prediction buffer to smooth flickering
buffer_size = 10
pred_buffer = deque(maxlen=buffer_size)

def normalize_landmarks(landmarks):
    """
    Normalize landmarks to relative coordinates (0-1) based on hand bounding box
    """
    landmarks = np.array(landmarks)
    x_min = np.min(landmarks[:, 0])
    y_min = np.min(landmarks[:, 1])
    x_max = np.max(landmarks[:, 0])
    y_max = np.max(landmarks[:, 1])

    width = x_max - x_min
    height = y_max - y_min

    if width == 0: width = 1
    if height == 0: height = 1

    normalized = (landmarks - [x_min, y_min]) / [width, height]
    return normalized.flatten().reshape(1, -1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    framergb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    className = ''

    try:
        result = hands.process(framergb)
        if result.multi_hand_landmarks:
            landmarks = []
            for handslms in result.multi_hand_landmarks:
                for lm in handslms.landmark:
                    landmarks.append([lm.x, lm.y])
                mpDraw.draw_landmarks(frame, handslms, mpHands.HAND_CONNECTIONS)

            if len(landmarks) == 21:
                landmarks_flat = normalize_landmarks(landmarks)
                prediction = model.predict(landmarks_flat, verbose=0)
                classID = np.argmax(prediction)
                pred_prob = np.max(prediction)

                # Debugging prints
                print(f"Prediction probabilities: {prediction}")
                print(f"Predicted class: {classNames[classID]}, probability: {pred_prob}")

                # Only append if confident
                if pred_prob > 0.1:
                    pred_buffer.append(classNames[classID])

        # Smooth predictions
        if pred_buffer:
            most_common = Counter(pred_buffer).most_common(1)
            className = most_common[0][0]

        # Display gesture name
        if className:
            cv2.putText(frame, className, (10, 50), cv2.FONT_HERSHEY_SIMPLEX,
                        1, (0, 0, 255), 2, cv2.LINE_AA)

        # Display sign image
        if className in signs:
            sign_img = cv2.resize(signs[className], (200, 200))
            frame[0:200, frame.shape[1]-200:frame.shape[1]] = sign_img

    except Exception as e:
        print("Error:", e)

    cv2.imshow("Hand Gesture Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()