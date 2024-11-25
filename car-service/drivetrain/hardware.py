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

    def _validate_and_scale_speed(self, speed: int) -> float:
        """Validate and scale the speed from 1-10 to 0.1-1.0."""
        if not isinstance(speed, int) or not (0 <= speed <= 10):
            raise ValueError("Speed must be an integer between 0 and 10.")
        return speed / 10

    def _validate_and_scale_angle(self, angle: int) -> float:
        """Validate and scale the angle from -10 to 10 to -1.0 to 1.0."""
        if not isinstance(angle, int) or not (-10 <= angle <= 10):
            raise ValueError("Angle must be an integer between -10 and 10.")
        return max(-1.0, min(angle / 10, 1.0))  # Clamp the scaled value

    def forward(self, speed=1, angle=0):
        speed = self._validate_and_scale_speed(speed)
        angle = self._validate_and_scale_angle(angle)

        if speed == 0:  # Stop motors if speed is 0
            self.stop()
            return
        
        left_speed = max(0, min(speed * (1 - angle) * self.left_calibration, 1)) * 100
        right_speed = max(0, min(speed * (1 + angle) * self.right_calibration, 1)) * 100

        left_pwm.ChangeDutyCycle(left_speed)
        right_pwm.ChangeDutyCycle(right_speed)

        GPIO.output(self.left_motor_pins[0], GPIO.HIGH)
        GPIO.output(self.left_motor_pins[1], GPIO.LOW)
        GPIO.output(self.right_motor_pins[0], GPIO.HIGH)
        GPIO.output(self.right_motor_pins[1], GPIO.LOW)

        print(f"TWO_WHEEL_DRIVE: Moving forward with speed {speed * 10}, turning angle {angle * 10}")

    def backward(self, speed=1, angle=0):
        speed = self._validate_and_scale_speed(speed)
        angle = self._validate_and_scale_angle(angle)

        if speed == 0:  # Stop motors if speed is 0
            self.stop()
            return
        
        left_speed = max(0, min(speed * (1 - angle) * self.left_calibration, 1)) * 100
        right_speed = max(0, min(speed * (1 + angle) * self.right_calibration, 1)) * 100

        left_pwm.ChangeDutyCycle(left_speed)
        right_pwm.ChangeDutyCycle(right_speed)

        GPIO.output(self.left_motor_pins[0], GPIO.LOW)
        GPIO.output(self.left_motor_pins[1], GPIO.HIGH)
        GPIO.output(self.right_motor_pins[0], GPIO.LOW)
        GPIO.output(self.right_motor_pins[1], GPIO.HIGH)

        print(f"TWO_WHEEL_DRIVE: Moving backward with speed {speed * 10}, turning angle {angle * 10}")

    def stationary_rotate(self, direction="left", speed=1):
        speed = self._validate_and_scale_speed(speed)

        if speed == 0:  # Stop motors if speed is 0
            self.stop()
            return

        if direction == "left":
            left_pwm.ChangeDutyCycle(speed * 100 * self.left_calibration)
            right_pwm.ChangeDutyCycle(speed * 100 * self.right_calibration)

            GPIO.output(self.left_motor_pins[0], GPIO.LOW)
            GPIO.output(self.left_motor_pins[1], GPIO.HIGH)
            GPIO.output(self.right_motor_pins[0], GPIO.HIGH)
            GPIO.output(self.right_motor_pins[1], GPIO.LOW)

            print(f"TWO_WHEEL_DRIVE: Rotating left in place with speed {speed * 10}")

        elif direction == "right":
            left_pwm.ChangeDutyCycle(speed * 100 * self.left_calibration)
            right_pwm.ChangeDutyCycle(speed * 100 * self.right_calibration)

            GPIO.output(self.left_motor_pins[0], GPIO.HIGH)
            GPIO.output(self.left_motor_pins[1], GPIO.LOW)
            GPIO.output(self.right_motor_pins[0], GPIO.LOW)
            GPIO.output(self.right_motor_pins[1], GPIO.HIGH)

            print(f"TWO_WHEEL_DRIVE: Rotating right in place with speed {speed * 10}")

        else:
            raise ValueError("Direction must be 'left' or 'right'")

    def stop(self):
        left_pwm.ChangeDutyCycle(0)
        right_pwm.ChangeDutyCycle(0)

        GPIO.output(self.left_motor_pins[0], GPIO.LOW)
        GPIO.output(self.left_motor_pins[1], GPIO.LOW)
        GPIO.output(self.right_motor_pins[0], GPIO.LOW)
        GPIO.output(self.right_motor_pins[1], GPIO.LOW)

        print("TWO_WHEEL_DRIVE: Motors stopped")


if __name__ == "__main__":
    try:
        twd = TwoWheelDrive(left_motor_pins=(5, 6), right_motor_pins=(17, 27), left_calibration=1.0, right_calibration=0.9)
        twd.forward(speed=8, angle=2)
        sleep(1)
        twd.backward(speed=8, angle=-3)
        sleep(1)
        twd.stationary_rotate(direction="left", speed=7)
        sleep(1)
        twd.stationary_rotate(direction="right", speed=7)
        sleep(1)
        twd.stop()
    except KeyboardInterrupt:
        print("Exiting... Cleaning up GPIO.")
        GPIO.cleanup()
    except Exception as e:
        print(f"Error: {e}")
        GPIO.cleanup()
