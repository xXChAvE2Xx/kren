 <?php

	require $_SERVER["DOCUMENT_ROOT"].'/kren/conexion.php';

	$axn = $_POST['axn'];

	switch($axn)
	{
		case 'listado_cursos':

			$sql = "SELECT id_curso, nombre_curso, nombre_ponente, siguiente FROM Cursos;";
			$result = $conn->query($sql);	
			$i=1;

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$cursos[$i]   = $row["id_curso"];
					$cursos[$i+1] = $row["nombre_curso"];
					$cursos[$i+2] = $row["nombre_ponente"];
					$cursos[$i+3] = $row["siguiente"];
					$i=($i+4);
				}
			} 
			else 
			{
			  echo "0 results";
			}
			echo json_encode($cursos);

		break;

		case 'info_empleado':
			$id_empleado = $_POST['id_empleado'];
			$sql = "SELECT nombre_empleado, Edad, Telefono, Fecha_Nac, correo, domicilio, area, RFID_ID FROM Empleados WHERE id_empleado = '$id_empleado';";
			$result = $conn->query($sql);	
			$i=1;

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					
					$empleado[$i] = $row["Edad"];
					$empleado[$i+1] = $row["Telefono"];
					$empleado[$i+2] = $row["Fecha_Nac"];
					$empleado[$i+3] = $row["correo"];
					$empleado[$i+4] = $row["domicilio"];
					$empleado[$i+5] = $row["area"];
					$empleado[$i+6] = $row["RFID_ID"];
					$i=($i+7);
				}
			} 
			echo json_encode($empleado);
		break;

		case 'listado_empleados':

			$sql = "SELECT id_empleado, nombre_empleado, area FROM Empleados;";
			$result = $conn->query($sql);	
			$i=1;

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$empleados[$i]   = $row["id_empleado"];
					$empleados[$i+1] = $row["nombre_empleado"];
					$empleados[$i+2] = $row["area"];
					$i=($i+3);
				}
			} 
			else 
			{
			  echo "0 results";
			}
			echo json_encode($empleados);

		break;

		case 'mostrar_curso_detalle':

			$id_curso = $_POST['id_curso'];
			$sql = "SELECT descripcion, fecha_hora_inicio, fecha_hora_fin, siguiente FROM Cursos WHERE id_curso = ".$id_curso.";";
			$result = $conn->query($sql);
			$newFin = "";	
		 	$newInicio = "";

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$datos_curso[1] = $row["descripcion"];

					//Validamos que ya se haya aplicado, para poder realizar la conversion de la fecha
					if ($row["fecha_hora_inicio"] != null && $row["fecha_hora_fin"] != null) {
						$inicio = $row["fecha_hora_inicio"]; 
				        $fin = $row["fecha_hora_fin"];

				        //Convierte la fecha y el tiempo en segundos
				        $segInicio = strtotime($inicio);  
				        $segFin = strtotime($fin); 

				        //Conversion a un formato en especifico D/M/AAAA y H:S:MS
				        $newInicio = date("d/m/Y H:i", $segInicio);
				        $newFin = date("d/m/Y H:i", $segFin);  

				        //Juntamos los segundos con el tiempo 
				        $newInicio = $newInicio.":00";
				        $newFin = $newFin.":00"; 
					}else{
						$newFin = $row["fecha_hora_fin"];
						$newInicio = $row["fecha_hora_inicio"];
					}

					$datos_curso[2] = $newInicio;
					$datos_curso[3] = $newFin;
					$datos_curso[4] = $row["siguiente"];
				}
			} 
			echo json_encode($datos_curso);
		break;

		case 'borrar_curso':
			$id_curso = $_POST['id_curso'];
			$sql = "DELETE FROM Cursos WHERE id_curso = ".$id_curso.";";
			$result = $conn->query($sql);	
		    echo json_encode($result);
		break;

		case 'borrar_empleado':
			$id_empleado = $_POST['id_empleado'];
			$sql = "DELETE FROM Empleados WHERE id_empleado = ".$id_empleado.";";
			$result = $conn->query($sql);
	
		    echo json_encode($result);
		break;

		case 'crear_curso':
			$nombre = $_POST['nombre'];
			$ponente = $_POST['ponente'];
			$descripcion = $_POST['descripcion'];
			$siguiente = $_POST['siguiente'];

			if($siguiente=='true')
			{
				$sql="UPDATE Cursos SET  siguiente = '0' WHERE siguiente = '1';";
				$result = $conn->query($sql);

				$sql = "INSERT INTO Cursos (nombre_curso, nombre_ponente, descripcion, siguiente) VALUES ('$nombre','$ponente','$descripcion','1');";
				$result = $conn->query($sql);
			}else{
				$sql = "INSERT INTO Cursos (nombre_curso, nombre_ponente, descripcion, siguiente) VALUES ('$nombre','$ponente','$descripcion','0');";
				$result = $conn->query($sql);
			}

			echo json_encode($result);
		break;

		case 'actualizar_curso':
			$id_curso = $_POST['id_curso'];
			$nombre_curso = $_POST['nombre_curso'];
			$ponente = $_POST['ponente'];
		    $descripcion = $_POST['descripcion'];
			$siguiente = $_POST['siguiente'];
				if($siguiente == 'true')
				{
					$siguiente = 1;
					$sql="UPDATE Cursos SET  siguiente = '0' WHERE siguiente = '1';";
					$result = $conn->query($sql);
				}
				else
					$siguiente = 0;

			   $sql="UPDATE Cursos SET nombre_curso = '$nombre_curso', nombre_ponente= '$ponente', descripcion = '$descripcion', siguiente = '$siguiente' WHERE id_curso = ".$id_curso.";";
		       $result = $conn->query($sql);	
		    echo json_encode($result);
		break;

		case 'actualizar_empleado':
			$id_empleado = $_POST['id_empleado'];
			$nombre_empleado = $_POST['nombre_empleado'];
			$correo = $_POST['correo'];
			$fecha_nac = $_POST['fecha_nac'];
			$area_departamento = $_POST['area_departamento'];
			$telefono = $_POST['telefono'];
			$domicilio = $_POST['domicilio'];
			$rfid = $_POST['rfid'];

			$sql="UPDATE Empleados SET nombre_empleado = '$nombre_empleado', Telefono = '$telefono', Fecha_Nac = '$fecha_nac', correo = '$correo', domicilio = '$domicilio', area = '$area_departamento', RFID_ID = '$rfid' WHERE id_empleado = ".$id_empleado.";";
			$result = $conn->query($sql);	
		    echo json_encode($result);
		break;

		case 'agregar_empleado':
			$nombre_empleado = $_POST['nombre'];
			$correo = $_POST['correo'];
			$fecha_nacimiento= $_POST['fecha_nacimiento'];
			$telefono = $_POST['telefono'];
		    $domicilio = $_POST['domicilio'];
		    $area_departamento = $_POST['area_departamento'];
		    $rfid = $_POST['id_RFID'];
		
			
		    $edad = date('Y')-substr($fecha_nacimiento, 0, -6);
		    
			$sql="INSERT INTO Empleados (id_curso, nombre_empleado, Edad, Telefono, Fecha_Nac, correo, domicilio, area, RFID_ID) VALUES (NULL, '$nombre_empleado','$edad','$telefono','$fecha_nacimiento','$correo','$domicilio','$area_departamento', '$rfid');";
			$result = $conn->query($sql);
			echo json_encode($result); 

		break;

		
		case 'traer_id_rfid':
			$estado = false;
			$data = exec("python3 /var/www/html/kren/py/enviar_Id_RFID.py");

		    $valid="SELECT RFID_ID, nombre_empleado FROM Empleados WHERE RFID_ID =".$data.";";

		    $validacion = $conn->query($valid);

		    if($validacion->num_rows > 0){
		    	$estado = false;
		    }else{
		    	$estado = true;
		    }

		    $result = array('id' => $data , 'estado' => $estado);
			echo json_encode($result);
			
		break;

		case 'actualizar_Entradas':
			$sql = "SELECT nombre_curso, nombre_empleado, entrada FROM vw_actividad";

		    $result = $conn->query($sql);

		    $newEntrada  = "";

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_array(MYSQLI_BOTH))
				{
					$entrada = $row['entrada']; 

			        //Convierte la fecha y el tiempo en segundos
			        $segEntrada = strtotime($entrada);  

			        //Conversion a un formato en especifico D/M/AAAA y H:S:MS
			        $newEntrada = date("d/m/Y H:i", $segEntrada); 

			        //Juntamos los segundos con el tiempo 
			        $newEntrada = $newEntrada.":00";

			        echo '<p>'.$newEntrada.' '.$row["nombre_empleado"].' entro al curso: '.$row["nombre_curso"].'</p>';
				}
			} 
			else 
			{
			  echo "No hay Registros";
			}

		break;

		case 'comprobar_correo':
			$correo = $_POST['correo'];
			$sql = "SELECT id_administrador FROM Administrador WHERE correo='$correo';";
			$result = $conn->query($sql);	
			if ($result->num_rows > 0)
				echo 'true';
			else
				echo 'false';
		break;

		case 'login':
			$correo = $_POST['correo'];
			$password = $_POST['password'];
			$sql = "SELECT nombre FROM Administrador WHERE correo='$correo' AND password ='$password';";
			$result = $conn->query($sql);	
			if ($result->num_rows > 0)
			{
				session_start();
				while($row = $result->fetch_assoc())
				{
					$_SESSION['nombre']  = $row['nombre'];
				}
				echo 'true';
			}
			else
				echo 'false';
		break;

		case 'traer_estado':

			$sql = "SELECT boton, web FROM status WHERE id=1;";
			$result = $conn->query($sql);

			if($result->num_rows > 0){
				while($row = $result->fetch_assoc())
				{
					$web = $row['web'];
					$boton = $row['boton'];
				}
			}
			$result = array('boton' => $boton , 'web' => $web);
			echo json_encode($result);
		break;

		case 'enviar_estado':
			$valor = $_POST['valor'];
			$sql = "UPDATE status SET web=$valor WHERE id=1;";
			$result = $conn->query($sql);
			echo $result;
		break;

		case 'borrar_Act_Act':
			$sql = "DELETE FROM Act_Act;";
			$result = $conn->query($sql);
			echo $result;
		break;
		case 'asistencias':
			$id_curso = $_POST['id_curso'];
			$i=0;
			$asistencias[]=0;
			$sql = "SELECT * FROM vw_most_asis WHERE id_curso = '$id_curso';";

			$result = $conn->query($sql);	
			if ($result->num_rows > 0)
			{
			
				while($row = $result->fetch_assoc())
				{
					$asistencias[$i]   = $row['id_empleado'];
					$asistencias[$i+1] = $row['nombre_empleado'];
					$asistencias[$i+2] = $row['area'];
					$asistencias[$i+3] = $row['entrada'];
					$asistencias[$i+4] = $row['salida'];
					$i=$i+5;
				}

				echo json_encode($asistencias);
			}
			else
				echo json_encode('ERROR');
		break;

		case 'asistencias_empleado_curso_especifico':
			$id_curso = $_POST['id_curso'];
			$id_empleado = $_POST['id_empleado'];
			
			$i=0;
			$asistencias[]=0;

			$sql = "SELECT entrada, salida FROM RFID WHERE id_empleado ='$id_empleado' AND id_curso = '$id_curso';";
			
			$result = $conn->query($sql);

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{  
			        $entrada = $row['entrada']; 
			        $salida = $row['salida'];

			        //Convierte la fecha y el tiempo en segundos
			        $segEntrada = strtotime($entrada);  
			        $segSalida = strtotime($salida); 

			        //Conversion a un formato en especifico D/M/AAAA y H:S:MS
			        $newEntrada = date("d/m/Y H:i", $segEntrada);
			        $newSalida = date("d/m/Y H:i", $segSalida);  

			        //Juntamos los segundos con el tiempo 
			        $newEntrada = $newEntrada.":00";
			        $newSalida = $newSalida.":00"; 
   					
   					//Mandamos nuevo formato de la fecha
					$asistencias[$i]   = $newEntrada;
					$asistencias[$i+1] = $newSalida;
					$i=$i+2;
				}

				echo json_encode($asistencias);
			}
			else
				echo json_encode('ERROR');
		break;

		case 'agendar_curso':
			$id_curso = $_POST['id_curso'];

			$sql="UPDATE Cursos SET  siguiente = '0' WHERE siguiente = '1';";
			$result = $conn->query($sql);

			$agendar_curso="UPDATE Cursos SET  siguiente = '1' WHERE id_curso=".$id_curso.";";
			$result = $conn->query($agendar_curso);

			echo $result;
		break;

		default:
			exit(0);
	}

?>

