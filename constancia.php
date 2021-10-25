<?php
require('lib/fpdf/fpdf.php');
require('conexion.php');

$id_curso = isset($_GET["id_curso"]) ? $_GET["id_curso"]: null; 

$nombre_emp = isset($_GET["nombre"]) ? $_GET["nombre"]: null;
$nombre_curso = isset($_GET["nom_curso"]) ? $_GET["nom_curso"]: null;
$entrada = isset($_GET["entrada"]) ? $_GET["entrada"]: null;
$salida = isset($_GET["salida"]) ? $_GET["salida"]: null;
$area = isset($_GET["area"]) ? $_GET["area"]: null;

$nombre = "";
$curso = "";

if($id_curso != null){
	$sql = "SELECT * FROM vw_constancia WHERE id_curso = '$id_curso';"
	//$sql = "SELECT Empleados.id_empleado, Empleados.nombre_empleado, Cursos.nombre_curso, Cursos.fecha_hora_inicio FROM RFID 
		//INNER JOIN Empleados ON RFID.id_empleado = Empleados.id_empleado 
		//INNER JOIN Cursos ON RFID.id_curso = Cursos.id_curso
		//WHERE RFID.id_curso = '$id_curso'";

	$query = $conn->query($sql);

	if($query->num_rows > 0){
		while($row = $query->fetch_assoc()){
			$nombre = $row["nombre_empleado"];
			$curso = $row["nombre_curso"];
		}
	}else{
		echo "False";
	}
}


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

$constancia = "<b>CONSTANCIA</b>";
$html = 'Por su asistencia y participacion en el curso<b>"'.$nombre_curso.'"</b>';

$pdf = new PDF('L', 'mm', 'A4');
// Primera p�gina
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
?>
