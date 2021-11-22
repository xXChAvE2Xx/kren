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

con = mysql.connector.connect(user='root', password='T3si2', host='localhost', database='kren_db')

def main():
	try:
		GPIO.setmode(GPIO.BOARD) # Usamos el numero Fisico
		GPIO.setup(led_espera, GPIO.OUT)#Configuracion de los LEDs
		GPIO.setup(led_rfid, GPIO.OUT)#Configuracion de los LEDs
		GPIO.setup(pin_led_error, GPIO.OUT) #Configuracion de los LEDs

		GPIO.output(led_espera, GPIO.HIGH )
		GPIO.output(led_rfid, GPIO.LOW)
		GPIO.output(pin_led_error, GPIO.LOW)

		GPIO.setup(boton_inicio, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Configuracion del boton inicio
		#GPIO.add_event_detect(boton_inicio, GPIO.RISING, callback=iniciar_lectura) # Evento de configuración en el flanco ascendente del pin 10
		GPIO.setup(boton_fin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) #Configuracion del boton fin
		GPIO.add_event_detect(boton_fin, GPIO.RISING) # Evento de configuración en el flanco ascendente del pin 8

		iniciar = GPIO.wait_for_edge(boton_inicio, GPIO.RISING) #para debug= timeout=5000 Esperamos a que se presione el boton inicio

		if iniciar is None:
			GPIO.output(led_espera, GPIO.LOW)
		else:
			leer_tags()
	except KeyboardInterrupt:
		print("Se cerro con ctr+c")
	finally:
		GPIO.cleanup() # Limpiamos

#####################################################################################################
#####################################################################################################
#####################################################################################################
#####################################################################################################
def leer_tags():
	cursorC= con.cursor()#Sirve para obtener el id del curso

	cursorC.execute("SELECT id_curso FROM Cursos WHERE siguiente = 1")
	resu_id = cursorC.fetchone()

	if cursorC.rowcount >= 1:
		idCurso = resu_id[0]
	else:
		idCurso = 0

	print("IdCurso:",idCurso)

	
	cursor = con.cursor()#Selecciona los empleados
	cursorF = con.cursor()#Selecciona la llave maestra
	cursorH = con.cursor()#Sirve para agregar la hora de inicio y la hora de fin
	cursorValid = con.cursor()#Sirve para validad curso

	cursorValid.execute("SELECT fecha_hora_inicio, fecha_hora_fin FROM Cursos WHERE id_curso="+str(idCurso))
	resuCurso = cursorValid.fetchone()

	agregarHoraInicio = ("UPDATE Cursos SET fecha_hora_inicio = %s WHERE id_curso = %s")
	agregarHoraFin = ("UPDATE Cursos SET fecha_hora_fin = %s WHERE id_curso = %s")

	datosHoraInicio = (str(datetime.now()), idCurso)

	if resuCurso[0] == None:
		cursorH.execute(agregarHoraInicio, datosHoraInicio)

	agregarStatus = ("UPDATE status SET boton = %s WHERE id = %s")
	datosStatus = (1, 1)

	agregar_entrada = ("INSERT INTO RFID (id_curso, id_empleado, entrada, salida) VALUES (%s, %s, %s, %s)")	

	cursor.execute(agregarStatus, datosStatus)
	con.commit()

	rfid = SimpleMFRC522()
	#LED
	GPIO.setup(pin_led_success, GPIO.OUT) #Configuracion de los LEDs
	
	try:
		GPIO.output(led_espera, GPIO.LOW)
		GPIO.output(led_rfid, GPIO.HIGH)
		while True:
			if idCurso == 0:
				break

			print("Pase la tarjeta por el Lector --> ")
			id, text = rfid.read()
			
			#query que obtendra el usuario
			cursor.execute("SELECT id_empleado, RFID_ID, nombre_empleado FROM Empleados WHERE RFID_ID="+str(id))
			resultado = cursor.fetchone()

			cursorF.execute("SELECT id_tag FROM verify WHERE id_tag="+str(id))
			salir = cursorF.fetchone()
			
			if cursorF.rowcount >= 1:
				GPIO.output(led_espera, GPIO.HIGH)
				GPIO.output(pin_led_error, GPIO.HIGH)
				GPIO.output(led_rfid, GPIO.LOW)
				salida = GPIO.wait_for_edge(boton_fin, GPIO.RISING) #para debug= timeout=5000 Esperamos a que se presione el boton inicio

				if salida is None:
					GPIO.output(led_espera, GPIO.LOW)
				else:
					iniciar_Registro_fin()
					break

			if cursor.rowcount >= 1: #si se existe el usuario, entonces lo agregamos a la tabla de asistencias
	
				id_empleado = resultado[0];

				datos_entrada=(idCurso, id_empleado, str(datetime.now()), 0)
				cursor.execute(agregar_entrada, datos_entrada)
				con.commit()
					
					
				print("Bienvenido "+resultado[2])
				print("RFID: ", id)
				
				GPIO.output(pin_led_success, GPIO.HIGH )
			else: #Si no existe no se hace nad, o podriamos mostrar un led Rojo
				print("Error: Usuario no existe en la base de datos!")
				print("RFID: ", id)
				GPIO.output(pin_led_error, GPIO.HIGH )

			time.sleep(1) #dejamos un segundo de espera
			GPIO.output(pin_led_success, GPIO.LOW)
			GPIO.output(pin_led_error, GPIO.LOW)
	finally:
		GPIO.output(led_rfid, GPIO.LOW)
		GPIO.cleanup() #Limpiamos

		datosStatusOff =(0, 1)
		cursor.execute(agregarStatus, datosStatusOff)

		datosHoraFin = (str(datetime.now()), idCurso)
		cursorH.execute(agregarHoraFin, datosHoraFin)
		con.commit()

		cursor.close()
		cursorF.close()
		cursorH.close()
		cursorC.close()
		cursorValid.close()
		print("Finalizo")
		main()


#####################################################################################################
#####################################################################################################
#####################################################################################################
def iniciar_Registro_fin():
	GPIO.output(led_espera, GPIO.LOW)
	GPIO.output(pin_led_error, GPIO.LOW)
	GPIO.output(led_rfid, GPIO.HIGH)
	
	while True:
		print("Pase la tarjeta por el Lector (Salida)--> ")
		rfid = SimpleMFRC522()
		id, text = rfid.read()

		cursor = con.cursor()#Selecciona los empleados
		cursorF = con.cursor()#Selecciona la llave maestra

		agregarSalida = ("UPDATE RFID SET salida = %s WHERE id_empleado = %s")
		
		#query que obtendra el usuario
		cursor.execute("SELECT id_empleado FROM Empleados WHERE RFID_ID="+str(id))
		resultado = cursor.fetchone()

		cursorF.execute("SELECT id_tag FROM verify WHERE id_tag="+str(id))
		salir = cursorF.fetchone()

		if cursorF.rowcount >= 1:
			break

		if cursor.rowcount >= 1: #si se existe el usuario, entonces lo agregamos a la tabla de asistencias
			print("Hasta Luego")
			print("RFID: ", id)
			id_empleado = resultado[0];

			datos_salida =(str(datetime.now()), id_empleado)

			cursor.execute(agregarSalida, datos_salida)
			con.commit()

			GPIO.output(pin_led_success, GPIO.HIGH )
		else: #Si no existe no se hace nad, o podriamos mostrar un led Rojo
			print("Error: Usuario no existe en la base de datos!")
			print("RFID: ", id)
			GPIO.output(pin_led_error, GPIO.HIGH )

		time.sleep(1) #dejamos un segundo de espera
		GPIO.output(pin_led_success, GPIO.LOW)
		GPIO.output(pin_led_error, GPIO.LOW)

if __name__ == "__main__":
	main()