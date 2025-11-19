# dummy_model_creator.py

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input

# Assume 21 landmarks with x,y coordinates = 42 input features
input_shape = 42
num_classes = 5  # Number of gestures (change if needed)

# Create a simple fully-connected model
model = Sequential([
    Input(shape=(input_shape,)),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Save the model in .h5 format
model.save("mp_hand_gesture.h5")
print("Dummy model saved as mp_hand_gesture.h5")
