#Car Server
### Purpose
---
This subdirectory is for the car microservice. It exposes a RESTful api with endpoints to control a simple DC motor car. This microservice is designed to run on a raspberry pi, connected to a motor control module.

### Technology
---
- Software:
	- Python 
		- [Motor control library name]
		- [Raspberry Pi GPIO control library]
		- Flask RESTful API
- Hardware
	- 1x Raspberry Pi 3B+
	- 1x L298N DC Motor Driver
	- 2x Geared DC Motor (1:48 gear ratio)
	- 1x 6-12v Battery Pack
	- 1x USB A -> +/- lead converter
