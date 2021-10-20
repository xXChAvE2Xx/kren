<?php
$conn = new mysqli('localhost', 'root', '', 'kren_db');
if ($conn->connect_error) {
    die('Error de Conexión (' . $conn->connect_errno . ') '. $conn->connect_error);
}else{
    if (mysqli_connect_error()) {
        die('Error de Conexión (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
    }else{

    }
}
/*
$sql = "SELECT id_cliente, nombre_empresa FROM cliente";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
     echo "id&nbsp;&nbsp;|&nbsp;&nbsp;Nombre <br>";
  while($row = $result->fetch_assoc()) {
   
    echo  $row["id_cliente"]."&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;". $row["nombre_empresa"]."<br>";
  }
} else {
  echo "0 results";
}*/
?>
