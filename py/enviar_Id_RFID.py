import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import mysql.connector

con = mysql.connector.connect(user='root', password='T3si2', host='localhost', database='kren_db')

cursor = con.cursor()#Selecciona los empleados

agregarStatus = ("UPDATE status SET web = %s WHERE id = %s")
datosStatus = (1, 1)

cursor.execute(agregarStatus, datosStatus)
con.commit()

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
	datosStatusOff = (0, 1)
	cursor.execute(agregarStatus, datosStatusOff)
	con.commit()
	con.close()
	#GPIO.cleanup()