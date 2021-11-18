<?php
ini_set('max_execution_time', 0); // 0 = Ilimitado
require('lib/fpdf/fpdf.php');
require('lib/PHPMailer/PHPMailerAutoload.php');
require('conexion.php');

define ("SENDEREMAIL", "");
define ("SENDERNAME", "Kren System");
define ("SMTPHOST", "smtp.gmail.com");
define ("SMTPUSER", "");
define ("SMTPPASS", "");

//Para realizar pruebas descomentar "down" y comentar "isset($_GET["online"]) ? $_GET["online"]: null;"
$status = isset($_GET["online"]) ? $_GET["online"]: null;//"down";
$msg = isset($_GET["text"]) ? $_GET["text"]: null;
$id_curso = isset($_GET["idcurso"]) ? $_GET["idcurso"]: null;  
$nombre_emp = isset($_GET["nombre"]) ? $_GET["nombre"]: null;
$nombre_curso = isset($_GET["nom_curso"]) ? $_GET["nom_curso"]: null;
$entrada = isset($_GET["entrada"]) ? $_GET["entrada"]: null;
$salida = isset($_GET["salida"]) ? $_GET["salida"]: null;
$area = isset($_GET["area"]) ? $_GET["area"]: null;
$txt = "Terminado";

$nombre = "";
$curso = "";

class PDF extends FPDF
{
protected $B = 0;
protected $I = 0;
protected $U = 0;
protected $HREF = '';

function WriteHTML($html)
{
	// Interprete de HTML
	$html = str_replace("\n",' ',$html);
	$a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
	foreach($a as $i=>$e)
	{
		if($i%2==0)
		{
			// Text
			if($this->HREF)
				$this->PutLink($this->HREF,$e);
			else
				$this->MultiCell(270, 10, $e, 2, 'C');
		}
		else
		{
			// Etiqueta
			if($e[0]=='/')
				$this->CloseTag(strtoupper(substr($e,1)));
			else
			{
				// Extraer atributos
				$a2 = explode(' ',$e);
				$tag = strtoupper(array_shift($a2));
				$attr = array();
				foreach($a2 as $v)
				{
					if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
						$attr[strtoupper($a3[1])] = $a3[2];
				}
				$this->OpenTag($tag,$attr);
			}
		}
	}
}

function OpenTag($tag, $attr)
{
	// Etiqueta de apertura
	if($tag=='B' || $tag=='I' || $tag=='U')
		$this->SetStyle($tag,true);
	if($tag=='A')
		$this->HREF = $attr['HREF'];
	if($tag=='BR')
		$this->Ln(5);
}

function CloseTag($tag)
{
	// Etiqueta de cierre
	if($tag=='B' || $tag=='I' || $tag=='U')
		$this->SetStyle($tag,false);
	if($tag=='A')
		$this->HREF = '';
}

function SetStyle($tag, $enable)
{
	// Modificar estilo y escoger la fuente correspondiente
	$this->$tag += ($enable ? 1 : -1);
	$style = '';
	foreach(array('B', 'I', 'U') as $s)
	{
		if($this->$s>0)
			$style .= $s;
	}
	$this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
	// Escribir un hiper-enlace
	$this->SetTextColor(0,0,255);
	$this->SetStyle('U',true);
	$this->Write(5,$txt,$URL);
	$this->SetStyle('U',false);
	$this->SetTextColor(0);
}
}

if($id_curso != null && $status != null){
	//Se ejecuta si se va enviar y si es para todo el personal del curso
	$sql = "SELECT * FROM vw_constancia WHERE id_curso = '$id_curso';";
	$query = $conn->query($sql);
	if($status == "up"){
		$i = 0;
		// Plantilla del correo
		$subject = "Constancia de ";
		$message0 = "Te informamos que tu constancia ya fue generada.\n\n";

	    $mail = new PHPMailer;
	    $mail->CharSet = "UTF-8";  // Para acentos y caracteres especiales
	    $mail->isSMTP();                                      // Enviar via SMTP
	    $mail->Host = SMTPHOST;  // Especificar los servers de backup y principal de SMTP
	    $mail->SMTPAuth = true;                               // Activar autenticacion SMTP
	    $mail->Username = SMTPUSER;                 // Usuario SMTP
	    $mail->Password = SMTPPASS;                           // Contraseña SMTP
	    $mail->SMTPSecure = 'tls';                            // Activar encriptacion TLSted
	    $mail->Port = 587;                                    // Puerto TCP
	    $mail->From = SENDEREMAIL;
	    $mail->FromName = SENDERNAME;
	    $mail->isHTML(false);

	    foreach ($query as $row) {
			$nombreEmpleado = $row["nombre_empleado"];
			$nombre_curso = $row["nombre_curso"];
			$salida = $row["fecha_hora_inicio"];
			//$email = $row["correo"];
			$email = 'rchavez1@ucol.mx';
		    // Necesario porque FPDF no soporta UTF-8.
		    $nombre = iconv('UTF-8', 'windows-1252', $nombreEmpleado);

		    $constancia = "<b>CONSTANCIA</b>";
			$html = 'Por su asistencia y participacion en el curso<b>"'.$nombre_curso.'"</b>';

			$pdf = new PDF('L', 'mm', 'A4');
			$pdf->AddPage();
			$pdf->Image('img/background.jpg', 0, 0, 300, 230);
			$pdf->Image('img/wave.png', 0, 0, 300, 230, 'PNG');
			$pdf->SetFont('Arial','',30);
			$pdf->Image('img/raspberry.png',10,9,-500);
			$pdf->Image('img/kren.png',262,9,-230);
			$pdf->MultiCell(0,10,'UNIVERSIDAD DE COLIMA',0,'C');
			$pdf->SetFont('Arial','',20);
			$pdf->Ln(10);
			$pdf->Cell(0,10,'Otorga la presente',0,1,'C');
			$pdf->SetFont('Arial','',20);
			$pdf->WriteHTML($constancia);
			//$pdf->Cell(0,10,'CONSTANCIA',0,1,'C');
			$pdf->Cell(0,10,'A: '.$nombreEmpleado,0,1,'C');
			$pdf->Ln(10);
			$pdf->SetFont('Arial','',17);
			$pdf->WriteHTML($html);
			$pdf->SetFont('Arial','',14);
			$pdf->Ln(5);
			$pdf->Cell(0,10,'Colima, Mexico a'.$salida,0,1,'R');
			$pdf->Ln(14);
			$pdf->MultiCell(0,10,'NOMBRE_ENCARGADO',0,'C');
			$pdf->MultiCell(0,10,'PUESTO_ENCARGADO',0,'C');
			$pdf->Output('F', 'constancias/'.$nombre.$i.'.pdf', true);
			$i++;
			if (filter_var($email, FILTER_VALIDATE_EMAIL)){
		        $message = $message0;
				$message .= "Gracias por asistir al curso ".$nombre_curso;
		        $message .= "\n\nAtentamente,\n el equipo de Kren";
		        $mail->Subject = "Constancia de ".$nombre;
		        $mail->clearAddresses();       // remove previous recipient
		        $mail->addAddress($email);     // add a recipient
		        $mail->Body= $message;
		       	//$mail->AddAttachment('pdf/'.$nombre.$i.'.pdf', $nombre);
		       	if ($mail->AddAttachment('constancias/'.$nombre.$i.'.pdf', $nombre)) {
		       		echo "Se agrego el archivo ".$nombre.$i.'.pdf';
		       	}
	        	if(!$mail->Send()){
		            echo "Message could not be sent.";
		            echo "Mailer Error: " . $mail->ErrorInfo;
		            continue;
		        }else{
		            echo "Message sent to: ".$email."\n";
		        }
		        //unlink('constancias/'.$nombre.$i.'.pdf');
		    }else{
		    	echo $nombre."<br>";
		    	echo "Generada pero el email es invalido<br>";
		    }

		}
	}elseif ($status == "down") {
		$i=0;
		$old_nom = "";
		$id_nombre = 1;
		// Creamos un instancia de la clase ZipArchive
		$zip = new ZipArchive();
		// Creamos y abrimos un archivo zip temporal
		$zip->open("constancias.rar",ZipArchive::CREATE);
		if ($query->num_rows > 0){
			while($row = $query->fetch_assoc()){
				$nombreEmpleado = $row["nombre_empleado"];
				$nombre_curso = $row["nombre_curso"];
				$salida = $row["fecha_hora_inicio"];
			    // Necesario porque FPDF no soporta UTF-8.
			    $nombre = iconv('UTF-8', 'windows-1252', $nombreEmpleado);
			    if($old_nom == $nombre){
			    	$nombre = $nombre."_".$id_nombre;
			    	$id_nombre++;
			    }
			    $constancia = "<b>CONSTANCIA</b>";
				$html = 'Por su asistencia y participacion en el curso<b>"'.$nombre_curso.'"</b>';

				$pdf = new PDF('L', 'mm', 'A4');
				$pdf->AddPage();
				$pdf->Image('img/background.jpg', 0, 0, 300, 230);
				$pdf->Image('img/wave.png', 0, 0, 300, 230, 'PNG');
				$pdf->SetFont('Arial','',30);
				$pdf->Image('img/raspberry.png',10,9,-500);
				$pdf->Image('img/kren.png',262,9,-230);
				$pdf->MultiCell(0,10,'UNIVERSIDAD DE COLIMA',0,'C');
				$pdf->SetFont('Arial','',20);
				$pdf->Ln(10);
				$pdf->Cell(0,10,'Otorga la presente',0,1,'C');
				$pdf->SetFont('Arial','',20);
				$pdf->WriteHTML($constancia);
				$pdf->Cell(0,10,'A: '.$nombreEmpleado,0,1,'C');
				$pdf->Ln(10);
				$pdf->SetFont('Arial','',17);
				$pdf->WriteHTML($html);
				$pdf->SetFont('Arial','',14);
				$pdf->Ln(5);
				$pdf->Cell(0,10,'Colima, Mexico a'.$salida,0,1,'R');
				$pdf->Ln(14);
				$pdf->MultiCell(0,10,'NOMBRE_ENCARGADO',0,'C');
				$pdf->MultiCell(0,10,'PUESTO_ENCARGADO',0,'C');
				$pdf->Output('F', 'constancias/'.$nombre.$i.'.pdf', true);

				// Añadimos un archivo en la rais del zip.
				$zip->addFile('constancias/'.$nombre.$i.'.pdf', $nombre.".pdf");
				$i++;
				$old_nom = $nombre;
			}	
			// Una vez añadido los archivos deseados cerramos el zip.
			$zip->close();
			$filepath = "constancias.rar";
			// Creamos las cabezeras que forzaran la descarga del archivo como archivo zip.
			header('Content-Type: application/Zip');
			header('Content-Disposition: attachment; filename="constancias.rar"');
			header('Content-Length: '.filesize($filepath) );
			readfile($filepath);
			// Por último eliminamos el archivo temporal creado
			unlink('constancias.rar');//Destruye el archivo temporal
			$files = glob('constancias/*'); //obtenemos todos los nombres de los ficheros
			foreach($files as $file){
			    if(is_file($file))
			    unlink($file); //elimino el fichero
			}
			$i=0;
		}
	}else{
		echo "Ocurrio un problema";
		echo "<br> Estado: ".$status;
		echo "<br> id_curso: ".$id_curso;
	}	
}elseif ($nombre_emp != null && $nombre_curso != null){
	//Se ejecuta solo si es en especifico
	$constancia = "<b>CONSTANCIA</b>";
	$html = 'Por su asistencia y participacion en el curso<b>"'.$nombre_curso.'"</b>';

	$pdf = new PDF('L', 'mm', 'A4');
	// Primera pagina
	$pdf->AddPage();
	$pdf->Image('img/background.jpg', 0, 0, 300, 230);
	$pdf->Image('img/wave.png', 0, 0, 300, 230, 'PNG');
	$pdf->SetFont('Arial','',30);
	$pdf->Image('img/raspberry.png',10,9,-500);
	$pdf->Image('img/kren.png',262,9,-230);
	$pdf->MultiCell(0,10,'UNIVERSIDAD DE COLIMA',0,'C');
	$pdf->SetFont('Arial','',20);
	$pdf->Ln(10);
	$pdf->Cell(0,10,'Otorga la presente',0,1,'C');
	$pdf->SetFont('Arial','',20);
	$pdf->WriteHTML($constancia);
	//$pdf->Cell(0,10,'CONSTANCIA',0,1,'C');
	$pdf->Cell(0,10,'A: '.$nombre_emp,0,1,'C');
	$pdf->Ln(10);
	$pdf->SetFont('Arial','',17);
	$pdf->WriteHTML($html);
	$pdf->SetFont('Arial','',14);
	$pdf->Ln(5);
	$pdf->Cell(0,10,'Colima, Mexico a'.$salida,0,1,'R');
	$pdf->Ln(14);
	$pdf->MultiCell(0,10,'NOMBRE_ENCARGADO',0,'C');
	$pdf->MultiCell(0,10,'PUESTO_ENCARGADO',0,'C');
	$pdf->Output('D', $nombre_emp.'.pdf', true);

}else{
	$msg = "ERROR";
	$error = true;
	$i = -1;
}

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title><?php echo $msg ?></title>
</head>
<body>
<h5><?php if ($i==0){echo "Este curso aun no tiene asistencias";}elseif ($i > 0){ echo "Terminado";} 
		if ($error == true) {echo "ERROR: Faltan datos.";} ?></h5>
</body>
</html>
