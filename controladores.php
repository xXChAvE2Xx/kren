 <?php

	require $_SERVER["DOCUMENT_ROOT"].'/kren/conexion.php';
	require $_SERVER["DOCUMENT_ROOT"].'/kren/conexion.php';
	

	$axn = $_POST['axn'];

	switch($axn)
	{
		case 'listado_cursos':

			$sql = "SELECT id_curso, nombre_curso, nombre_ponente FROM Cursos;";
			$result = $conn->query($sql);	
			$i=1;

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$cursos[$i]   = $row["id_curso"];
					$cursos[$i+1] = $row["nombre_curso"];
					$cursos[$i+2] = $row["nombre_ponente"];
					$i=($i+3);
				}
			} 
			else 
			{
			  echo "0 results";
			}
			echo json_encode($cursos);

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
			$sql = "SELECT hora_aplicacion, fecha_aplicacion, usuarios_permitidos, usuarios_registrados, usuarios_ilimitados, descripcion FROM Cursos WHERE id_curso = ".$id_curso.";";
			$result = $conn->query($sql);	

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$info_curso[1] = $row["fecha_aplicacion"];
					$info_curso[2] = $row["hora_aplicacion"];
					$info_curso[3] = $row["usuarios_registrados"];
					$info_curso[4] = $row["usuarios_permitidos"];
					$info_curso[5] = $row["usuarios_ilimitados"];
					$info_curso[6] = $row["descripcion"];
				}
			} 
			echo json_encode($info_curso);
		break;

		case 'borrar_curso':
			$id_curso = $_POST['id_curso'];
			$sql = "DELETE FROM Cursos WHERE id_curso = ".$id_curso.";";
			$result = $conn->query($sql);	
		    echo json_encode($result);
		break;

		case 'crear_curso':
			$nombre = $_POST['nombre'];
			$ponente = $_POST['ponente'];
			$fecha= $_POST['fecha'];
			$hora = $_POST['hora'];
			$cant_usuarios = $_POST['cant_usuarios'];
			$usuarios_ilimitados = $_POST['usuarios_ilimitados'];
			$descripcion = $_POST['descripcion'];

			$sql = "INSERT INTO Cursos (nombre_curso,  hora_aplicacion, fecha_aplicacion, usuarios_registrados, usuarios_permitidos, usuarios_ilimitados, nombre_ponente, descripcion) VALUES ('$nombre','$hora','$fecha','0','$cant_usuarios','$usuarios_ilimitados','$ponente','$descripcion');";
			//$sql = "INSERT INTO cursos (hora_aplicacion) VALUES ('$hora');";
			
			
			$result = $conn->query($sql);	
		    echo json_encode($result);
		break;

		case 'actualizar_curso':
			$id_curso = $_POST['id_curso'];
			$nombre_curso = $_POST['nombre_curso'];
			$ponente = $_POST['ponente'];
			$fecha= $_POST['fecha'];
			$hora = $_POST['hora'];
		    $descripcion = $_POST['descripcion'];
		    $usuarios_permitidos = $_POST['usuarios_permitidos'];

		    if($usuarios_permitidos=='true')
		    {
			   $sql=" UPDATE Cursos
					SET nombre_curso = '$nombre_curso', nombre_ponente= '$ponente', hora_aplicacion = '$hora', fecha_aplicacion = '$fecha', usuarios_permitidos = '0', usuarios_ilimitados = '1', descripcion = '$descripcion' WHERE id_curso = ".$id_curso.";";
		    }else{
		    	$sql=" UPDATE Cursos
					SET nombre_curso = '$nombre_curso', nombre_ponente= '$ponente', hora_aplicacion = '$hora', fecha_aplicacion = '$fecha', usuarios_permitidos = '$usuarios_permitidos', usuarios_ilimitados = '0', descripcion = '$descripcion' WHERE id_curso = ".$id_curso.";";
		    }
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
		    
		    $valid="SELECT RFID_ID, nombre_empleado FROM Empleados WHERE RFID_ID =".$rfid.";";

		    $validacion = $conn->query($valid);

		    if($validacion->num_rows > 0){
		    	echo 0;
		    }
		    else{

		    	$sql="INSERT INTO Empleados (id_curso, nombre_empleado, Edad, Telefono, Fecha_Nac, correo, domicilio, area, RFID_ID) VALUES (NULL, '$nombre_empleado','$edad','$telefono','$fecha_nacimiento','$correo','$domicilio','$area_departamento', '$rfid');";
			    $result = $conn->query($sql);
			    echo json_encode($result); 
		    }
		break;

		
		case 'traer_id_rfid':
			$data = exec("python3 /var/www/html/kren/py/enviar_Id_RFID.py");

			echo $data;
		break;

		case 'actualizar_Entradas':
			$sql = "SELECT nombre_curso, nombre_empleado, entrada FROM vw_actividad";

		    $result = $conn->query($sql);

			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_array(MYSQLI_BOTH))
				{
					echo '<p>'.$row["entrada"].' '.$row["nombre_empleado"].' Entro al curso: '.$row["nombre_curso"].'</p>';
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

		default:
			exit(0);
	}

?>

