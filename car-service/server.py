from flask import Flask, request, jsonify

# from drivetrain.hardware import TwoWheelDrive
from drivetrain.simulation import TwoWheelDrive

app = Flask(__name__)
twd = TwoWheelDrive(left_motor_pins=(17, 18), right_motor_pins=(22, 23))

@app.route("/forward", methods=["POST"])
def forward():
    data = request.get_json()
    speed = data.get("speed", 1.0)
    angle = data.get("angle", 0.0)
    twd.forward(speed, angle)
    res = {
            "status": "moving forward",
            "speed": speed,
            "angle": angle
    }
    return jsonify(res)

@app.route("/backward", methods=["POST"])
def backward():
    data = request.get_json()
    speed = data.get("speed", 1.0)
    angle = data.get("angle", 0.0)
    twd.backward(speed, angle)
    res = {
            "status": "moving backward",
            "speed": speed,
            "angle": angle
    }
    return jsonify(res)

@app.route("/rotate", methods=["POST"])
def rotate():
    data = request.get_json()
    direction = data.get("direction", "left")
    speed = data.get("speed", 1.0)
    twd.stationary_rotate(direction, speed)
    res = {
            "status": f"rotating {direction}",
            "speed": speed
    }
    return jsonify(res)

@app.route("/stop", methods=["POST"])
def stop():
    twd.stop()
    res = {
            "status": "stopped"
    }
    return jsonify(res)

@app.route("/set_calibration", methods=["POST"])
def set_calibration():
    data = request.get_json()
    left_calibration = data.get("left_calibration", 1.0)
    right_calibration = data.get("right_calibration", 1.0)
    twd.set_calibration(left_calibration, right_calibration)
    res = {
            "status": "calibration set",
            "left_calibration": left_calibration,
            "right_calibration": right_calibration
    }
    return jsonify(res)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
