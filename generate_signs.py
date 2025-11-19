import cv2
import numpy as np
import os

# Create signs folder if it doesn't exist
if not os.path.exists("signs"):
    os.makedirs("signs")

gestures = ["fist", "palm", "thumbs_up", "peace", "ok"]
colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0), (0, 255, 255), (255, 0, 255)]

for i, gesture in enumerate(gestures):
    # Create blank image
    img = np.ones((200, 200, 3), dtype=np.uint8) * 255

    # Put gesture name text
    cv2.putText(img, gesture, (20, 100), cv2.FONT_HERSHEY_SIMPLEX,
                0.8, colors[i], 2, cv2.LINE_AA)

    # Save PNG
    cv2.imwrite(f"signs/{gesture}.png", img)

print("All gesture images created in 'signs/' folder!")
