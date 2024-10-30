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

    def forward(self, speed=1.0, angle=0.0):
        """
        Move forward with adjustable turning angle.

        :param speed: Speed of the motors (0 to 1)
        :param angle: Turning angle (0=straight, -1=left, 1=right)
        """
        left_speed = speed * (1 - angle) * self.left_calibration
        right_speed = speed * (1 + angle) * self.right_calibration
        self.left_motor.forward(max(0, min(left_speed, 1)))
        self.right_motor.forward(max(0, min(right_speed, 1)))
        print(f"TWO_WHEEL_DRIVE: Moving forward with speed {speed}, turning angle {angle}")

    def backward(self, speed=1.0, angle=0.0):
        """
        Move backward with adjustable turning angle.

        :param speed: Speed of the motors (0 to 1)
        :param angle: Turning angle (0=straight, -1=left, 1=right)
        """
        left_speed = speed * (1 - angle) * self.left_calibration
        right_speed = speed * (1 + angle) * self.right_calibration
        self.left_motor.backward(max(0, min(left_speed, 1)))
        self.right_motor.backward(max(0, min(right_speed, 1)))
        print(f"TWO_WHEEL_DRIVE: Moving backward with speed {speed}, turning angle {angle}")

    def stationary_rotate(self, direction="left", speed=1.0):
        """
        Rotate in place.

        :param direction: 'left' or 'right'
        :param speed: Speed of the rotation (0 to 1)
        """
        if direction == "left":
            self.left_motor.backward(speed * self.left_calibration)
            self.right_motor.forward(speed * self.right_calibration)
            print(f"TWO_WHEEL_DRIVE: Rotating left in place with speed {speed}")

        elif direction == "right":
            self.left_motor.forward(speed * self.left_calibration)
            self.right_motor.backward(speed * self.right_calibration)
            print(f"TWO_WHEEL_DRIVE: Rotating right in place with speed {speed}")

        else:
            raise ValueError("Direction must be 'left' or 'right'")

    def stop(self):
        """Stop both motors."""
        self.left_motor.stop()
        self.right_motor.stop()
        print("TWO_WHEEL_DRIVE: Motors stopped")

if __name__ == "__main__":
    from time import sleep

    twd = TwoWheelDrive(left_motor_pins=(17, 18), right_motor_pins=(22, 23), left_calibration=1.0, right_calibration=0.9)

    twd.forward(speed=0.8, angle=0.2)  # Forward with slight right turn
    sleep(1)
    twd.backward(speed=0.8, angle=-0.3)  # Backward with slight left turn
    sleep(1)
    twd.stationary_rotate(direction="left", speed=0.7)  # Stationary rotate left
    sleep(1)
    twd.stationary_rotate(direction="right", speed=0.7)  # Stationary rotate right
    sleep(1)
    twd.stop()
