#!/usr/bin/python
# -*- coding: latin-1 -*-

import RPi.GPIO as GPIO # Importamos libreria GPIO del Raspberry Pi
from mfrc522 import SimpleMFRC522
import mysql.connector
from datetime import datetime
from mysql.connector import errorcode
import os, signal, sys, time

GPIO.setwarnings(False)	# Ignoramos las advertencia por ahora


boton_inicio = 11
boton_fin = 13

pin_led_error = 7
pin_led_success = 12
led_espera = 8
led_rfid = 15
curso=0
def main():
	try:
		GPIO.setmode(GPIO.BOARD) # Usamos el numero Fisico
		GPIO.setup(led_espera, GPIO.OUT)#Configuracion de los LEDs
		GPIO.setup(led_rfid, GPIO.OUT)#Configuracion de los LEDs

		GPIO.output(led_espera, GPIO.HIGH )
		GPIO.output(led_rfid, GPIO.LOW)

		GPIO.setup(boton_inicio, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Configuracion del boton inicio
		#GPIO.add_event_detect(boton_inicio, GPIO.RISING, callback=iniciar_lectura) # Evento de configuración en el flanco ascendente del pin 10
		GPIO.setup(boton_fin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) #Configuracion del boton fin
		GPIO.add_event_detect(boton_fin, GPIO.RISING) # Evento de configuración en el flanco ascendente del pin 8

		iniciar = GPIO.wait_for_edge(boton_inicio, GPIO.RISING) # Esperamos a que se presione el boton inicio

		if iniciar is None:
			GPIO.output(led_espera, GPIO.LOW)
		else:
			iniciar_lectura(curso)
		#message = input("Esperando...\n\n") # En espera.
	except KeyboardInterrupt:
		print("Se cerro con ctr+c")
	finally:
		GPIO.cleanup() # Limpiamos

def leer_tags(idcursos):
	if idcursos == 0:
		print("IdCurso: 0",idcursos)#Se pondria un selecto para seleccionar el id de la base de datos
	else:
		print("idCursos: ",idcursos)
	con = mysql.connector.connect(user='root', password='T3si2', host='localhost', database='kren_db')
	cursor = con.cursor()
	cursorF = con.cursor() 

	agregarStatus = ("UPDATE status SET boton = %s WHERE id = %s")
	datosStatus =(1, 1)

	cursor.execute(agregarStatus, datosStatus)
	con.commit()

	rfid = SimpleMFRC522()
	#LED
	GPIO.setup(pin_led_error, GPIO.OUT) #Configuracion de los LEDs
	GPIO.setup(pin_led_success, GPIO.OUT) #Configuracion de los LEDs
	
	try:
		GPIO.output(led_espera, GPIO.LOW)
		GPIO.output(led_rfid, GPIO.HIGH)
		while True:
			print("Pase la tarjeta por el Lector --> ")
			id, text = rfid.read()
			
			#query que obtendra el usuario
			cursor.execute("Select id_empleado, RFID_ID, nombre_empleado from Empleados where RFID_ID="+str(id))
			resultado = cursor.fetchone()

			cursorF.execute("Select id_tag from verify where id_tag="+str(id))
			salir = cursorF.fetchone()

			agregar_entrada = ("INSERT INTO RFID (id_curso, id_empleado, entrada, salida) VALUES (%s, %s, %s, %s)")

			if cursorF.rowcount >= 1:
				print("end")
				break

			if cursor.rowcount >= 1: #si se existe el usuario, entonces lo agregamos a la tabla de asistencias
				print("Bienvenido "+resultado[2])
				print("RFID: ", id)
				tiempo = datetime.now()
				id_empleado = resultado[0];

				datos_entrada =(1, id_empleado, str(tiempo), str(tiempo))

				cursor.execute(agregar_entrada, datos_entrada)
				con.commit()

				GPIO.output(pin_led_success, GPIO.HIGH )
			else: #Si no existe no se hace nad, o podriamos mostrar un led Rojo
				print("Error: Usuario no existe en la base de datos!")
				print("RFID: ", id)
				GPIO.output(pin_led_error, GPIO.HIGH )

			time.sleep(0.5) #dejamos medio segundo de espera
			GPIO.output(pin_led_success, GPIO.LOW)
			GPIO.output(pin_led_error, GPIO.LOW)
	finally:
		GPIO.output(led_rfid, GPIO.LOW)
		GPIO.cleanup() #Limpiamos	
		datosStatusOff =(0, 1)
		cursor.execute(agregarStatus, datosStatusOff)
		con.commit()
		cursor.close()
		cursorF.close()
		con.close()
		print("Finalizo")
		main()

def iniciar_lectura(id_curso):
	leer_tags(id_curso);

def parar_lectura(channel):
	GPIO.cleanup()
	sys.exit("Exito!")

def id_curso(idcurso):
	GPIO.setmode(GPIO.BOARD) # Usamos el numero Fisico
	GPIO.setup(led_espera, GPIO.OUT)#Configuracion de los LEDs
	GPIO.setup(led_rfid, GPIO.OUT)#Configuracion de los LEDs

	leer_tags(idcurso)

if __name__ == "__main__":
	main()