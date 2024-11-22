#!/bin/bash

# Define the server base URL
BASE_URL="https://bcit4537-termproject-car-service.onrender.com"

# Test forward endpoint
echo "Testing /forward endpoint..."
curl -X POST -H "Content-Type: application/json" -d '{"speed": 4, "angle": 5}' "$BASE_URL/forward"
echo -e "\n"

# Test backward endpoint
echo "Testing /backward endpoint..."
curl -X POST -H "Content-Type: application/json" -d '{"speed": 2, "angle": -10}' "$BASE_URL/backward"
echo -e "\n"

# Test rotate left endpoint
echo "Testing /rotate endpoint with direction left..."
curl -X POST -H "Content-Type: application/json" -d '{"direction": "left", "speed": 2}' "$BASE_URL/rotate"
echo -e "\n"

# Test rotate right endpoint
echo "Testing /rotate endpoint with direction right..."
curl -X POST -H "Content-Type: application/json" -d '{"direction": "right", "speed": 10}' "$BASE_URL/rotate"
echo -e "\n"

# Test stop endpoint
echo "Testing /stop endpoint..."
curl -X POST -H "Content-Type: application/json" "$BASE_URL/stop"
echo -e "\n"

# Test set calibration endpoint
echo "Testing /set_calibration endpoint..."
curl -X POST -H "Content-Type: application/json" -d '{"left_calibration": 1.0, "right_calibration": 0.9}' "$BASE_URL/set_calibration"
echo -e "\n"

# Summary message
echo "All tests completed."
