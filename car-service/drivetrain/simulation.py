"""This code was made with the assistance of CHATGPT version 4o- to:
 - make recommendations
 - provide feedback
 - correct syntax and logic
 """

from gpiozero import Motor, Device
from gpiozero.pins.mock import MockFactory, MockPWMPin
from typing import Tuple

Device.pin_factory = MockFactory(pin_class=MockPWMPin)

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
        self.left_motor = Motor(forward=left_motor_pins[0],
                                backward=left_motor_pins[1])

        self.right_motor = Motor(forward=right_motor_pins[0],
                                 backward=right_motor_pins[1])

        self.left_calibration = left_calibration
        self.right_calibration = right_calibration

    def _validate_and_scale_speed(self, speed: int) -> float:
        """Validate and scale the speed from 1-10 to 0.1-1.0."""
        if not isinstance(speed, int) or not (1 <= speed <= 10):
            raise ValueError("Speed must be an integer between 1 and 10.")
        return speed / 10

    def _validate_and_scale_angle(self, angle: int) -> float:
        """Validate and scale the angle from -10 to 10 to -1.0 to 1.0."""
        if not isinstance(angle, int) or not (-10 <= angle <= 10):
            raise ValueError("Angle must be an integer between -10 and 10.")
        return angle / 10

    def forward(self, speed=1, angle=0):
        """
        Move forward with adjustable turning angle.

        :param speed: Speed of the motors (1 to 10)
        :param angle: Turning angle (-10=left, 0=straight, 10=right)
        """
        speed = self._validate_and_scale_speed(speed)
        angle = self._validate_and_scale_angle(angle)
        left_speed = speed * (1 - angle) * self.left_calibration
        right_speed = speed * (1 + angle) * self.right_calibration

        left_final = max(0, min(left_speed, 1))
        right_final = max(0, min(right_speed, 1))

        print("==========")
        print(f"left_final: {left_final}")
        print(f"right_final: {right_final}")

        self.left_motor.forward(left_final)
        self.right_motor.forward(right_final)

        print(f"TWO_WHEEL_DRIVE: Moving forward with speed {speed * 10}, turning angle {angle * 10}")

    def backward(self, speed=1, angle=0):
        """
        Move backward with adjustable turning angle.

        :param speed: Speed of the motors (1 to 10)
        :param angle: Turning angle (-10=left, 0=straight, 10=right)
        """
        speed = self._validate_and_scale_speed(speed)
        angle = self._validate_and_scale_angle(angle)
        left_speed = speed * (1 - angle) * self.left_calibration
        right_speed = speed * (1 + angle) * self.right_calibration
        self.left_motor.backward(max(0, min(left_speed, 1)))
        self.right_motor.backward(max(0, min(right_speed, 1)))
        print(f"TWO_WHEEL_DRIVE: Moving backward with speed {speed * 10}, turning angle {angle * 10}")

    def stationary_rotate(self, direction="left", speed=1):
        """
        Rotate in place.

        :param direction: 'left' or 'right'
        :param speed: Speed of the rotation (1 to 10)
        """
        speed = self._validate_and_scale_speed(speed)
        if direction == "left":
            self.left_motor.backward(speed * self.left_calibration)
            self.right_motor.forward(speed * self.right_calibration)
            print(f"TWO_WHEEL_DRIVE: Rotating left in place with speed {speed * 10}")

        elif direction == "right":
            self.left_motor.forward(speed * self.left_calibration)
            self.right_motor.backward(speed * self.right_calibration)
            print(f"TWO_WHEEL_DRIVE: Rotating right in place with speed {speed * 10}")

        else:
            raise ValueError("Direction must be 'left' or 'right'")

    def stop(self):
        """Stop both motors."""
        self.left_motor.stop()
        self.right_motor.stop()
        print("TWO_WHEEL_DRIVE: Motors stopped")

    def set_calibration(self, left_calibration, right_calibration):
        """
        Sets the calibration factor for each side's motor.
        
        :param left_calibration: Calibration factor for left motor
        :param right_calibration: Calibration factor for right motor
        """
        self.left_calibration = left_calibration
        self.right_calibration = right_calibration
        print(f"TWO_WHEEL_DRIVE: left and right calibration set to {left_calibration}, {right_calibration}")


if __name__ == "__main__":
    from time import sleep

    twd = TwoWheelDrive(left_motor_pins=(17, 18), right_motor_pins=(22, 23), left_calibration=1.0, right_calibration=0.9)

    twd.forward(speed=10, angle=-10)  # Forward with slight right turn
    twd.forward(speed=10, angle=0)  # Forward with slight right turn
    twd.forward(speed=10, angle=10)  # Forward with slight right turn
    twd.forward(speed=10, angle=2)  # Forward with slight right turn
    sleep(1)
    twd.backward(speed=8, angle=-3)  # Backward with slight left turn
    sleep(1)
    twd.stationary_rotate(direction="left", speed=7)  # Stationary rotate left
    sleep(1)
    twd.stationary_rotate(direction="right", speed=7)  # Stationary rotate right
    sleep(1)
    twd.stop()
