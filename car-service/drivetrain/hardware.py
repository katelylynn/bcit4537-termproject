import RPi.GPIO as GPIO
from time import sleep
from typing import Tuple

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

# Define motor pins based on your setup
# Right Motor
right_motor_pins = (17, 27)  # Forward, Backward
en_a = 4  # PWM pin for right motor

# Left Motor
left_motor_pins = (5, 6)  # Forward, Backward
en_b = 13  # PWM pin for left motor

# Initialize GPIO pins
GPIO.setup(right_motor_pins[0], GPIO.OUT)
GPIO.setup(right_motor_pins[1], GPIO.OUT)
GPIO.setup(en_a, GPIO.OUT)

GPIO.setup(left_motor_pins[0], GPIO.OUT)
GPIO.setup(left_motor_pins[1], GPIO.OUT)
GPIO.setup(en_b, GPIO.OUT)

# Initialize PWM control on enable pins
right_pwm = GPIO.PWM(en_a, 100)
left_pwm = GPIO.PWM(en_b, 100)
right_pwm.start(0)
left_pwm.start(0)


class TwoWheelDrive:
    def __init__(self, left_motor_pins: Tuple[int, int],
                       right_motor_pins: Tuple[int, int],
                       left_calibration=1.0,
                       right_calibration=1.0):
        """
        Drivetrain with motor control pins and optional calibration.
        :param left_motor_pins: forward and backward pins for left
        :param right_motor_pins: forward and backward pins for right
        :param left_calibration: Calibration factor for left motor
        :param right_calibration: Calibration factor for right motor
        """
        self.left_motor_pins = left_motor_pins
        self.right_motor_pins = right_motor_pins
        self.left_calibration = left_calibration
        self.right_calibration = right_calibration

    def forward(self, speed=1.0, angle=0.0):
        left_speed = max(0, min(speed * (1 - angle) * self.left_calibration, 1)) * 100
        right_speed = max(0, min(speed * (1 + angle) * self.right_calibration, 1)) * 100
        
        left_pwm.ChangeDutyCycle(left_speed)
        right_pwm.ChangeDutyCycle(right_speed)
        
        GPIO.output(self.left_motor_pins[0], GPIO.HIGH)
        GPIO.output(self.left_motor_pins[1], GPIO.LOW)
        GPIO.output(self.right_motor_pins[0], GPIO.HIGH)
        GPIO.output(self.right_motor_pins[1], GPIO.LOW)

        print(f"TWO_WHEEL_DRIVE: Moving forward with speed {left_speed}, {right_speed}, turning angle {angle}")

    def backward(self, speed=1.0, angle=0.0):
        left_speed = max(0, min(speed * (1 - angle) * self.left_calibration, 1)) * 100
        right_speed = max(0, min(speed * (1 + angle) * self.right_calibration, 1)) * 100
        
        left_pwm.ChangeDutyCycle(left_speed)
        right_pwm.ChangeDutyCycle(right_speed)
        
        GPIO.output(self.left_motor_pins[0], GPIO.LOW)
        GPIO.output(self.left_motor_pins[1], GPIO.HIGH)
        GPIO.output(self.right_motor_pins[0], GPIO.LOW)
        GPIO.output(self.right_motor_pins[1], GPIO.HIGH)

        print(f"TWO_WHEEL_DRIVE: Moving backward with speed {speed}, turning angle {angle}")

    def stationary_rotate(self, direction="left", speed=1.0):
        speed = max(0, min(speed, 1)) * 100
        
        if direction == "left":
            left_pwm.ChangeDutyCycle(speed * self.left_calibration)
            right_pwm.ChangeDutyCycle(speed * self.right_calibration)
            
            GPIO.output(self.left_motor_pins[0], GPIO.LOW)
            GPIO.output(self.left_motor_pins[1], GPIO.HIGH)
            GPIO.output(self.right_motor_pins[0], GPIO.HIGH)
            GPIO.output(self.right_motor_pins[1], GPIO.LOW)

            print(f"TWO_WHEEL_DRIVE: Rotating left in place with speed {speed}")

        elif direction == "right":
            left_pwm.ChangeDutyCycle(speed * self.left_calibration)
            right_pwm.ChangeDutyCycle(speed * self.right_calibration)
            
            GPIO.output(self.left_motor_pins[0], GPIO.HIGH)
            GPIO.output(self.left_motor_pins[1], GPIO.LOW)
            GPIO.output(self.right_motor_pins[0], GPIO.LOW)
            GPIO.output(self.right_motor_pins[1], GPIO.HIGH)

            print(f"TWO_WHEEL_DRIVE: Rotating right in place with speed {speed}")

    def stop(self):
        left_pwm.ChangeDutyCycle(0)
        right_pwm.ChangeDutyCycle(0)
        
        GPIO.output(self.left_motor_pins[0], GPIO.LOW)
        GPIO.output(self.left_motor_pins[1], GPIO.LOW)
        GPIO.output(self.right_motor_pins[0], GPIO.LOW)
        GPIO.output(self.right_motor_pins[1], GPIO.LOW)

        print("TWO_WHEEL_DRIVE: Motors stopped")

    def set_calibration(self, left_calibration, right_calibration):
        """
        Sets the calibration factor for each side's motor
        
        :param left_calibration: Calibration factor for left motor
        :param right_calibration: Calibration factor for right motor
        """
        self.left_calibration = left_calibration
        self.right_calibration = right_calibration

        print("TWO_WHEEL_DRIVE: left and right calibration set to {left_calibration}, {right_calibration}")


if __name__ == "__main__":
    twd = TwoWheelDrive(left_motor_pins=(5, 6), right_motor_pins=(17, 27), left_calibration=1.0, right_calibration=0.9)

    try:
        twd.forward(speed=0.8, angle=0.2)  # Forward with slight right turn
        sleep(1)
        twd.backward(speed=0.8, angle=-0.3)  # Backward with slight left turn
        sleep(1)
        twd.stationary_rotate(direction="left", speed=0.7)  # Stationary rotate left
        sleep(1)
        twd.stationary_rotate(direction="right", speed=0.7)  # Stationary rotate right
        sleep(1)
        twd.stop()
    except KeyboardInterrupt:
        GPIO.cleanup()
        print("GPIO Clean up")
