import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522


rfid = SimpleMFRC522()
GPIO.setmode(GPIO.BOARD)
led_rfid = 15

GPIO.setup(led_rfid, GPIO.OUT)#Configuracion de los LEDs
try:
	GPIO.output(led_rfid, GPIO.HIGH)
	id, text = rfid.read()
	data = str(id)
	print(data);
finally:
	GPIO.output(led_rfid, GPIO.LOW)
