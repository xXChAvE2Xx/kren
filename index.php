<?php
  session_start();
  if (!isset($_SESSION['nombre'])) 
    header('location: login_index.html');
  else{
  $user = $_SESSION["nombre"];
  //echo $user;
  } 
?>  
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta name="viewport" content="width=device-width, initial-scale=0.7, user-scalable=no">
  <title>kren.com</title>
  <link rel="shortcut icon" href="img/favicon.ico">

  <link href="lib/fontawesome/css/all.min.css" rel="stylesheet"><!--Fontawesome css-->
  <script href="lib/fontawesome/js/all.min.js" type="text/javascript"></script><!--Fontawesome js-->

  <link rel="stylesheet" href="css/animate.min.css"/><!--Animate.css-->

  <link href="lib/bootstrap/css/bootstrap.min.css" rel="stylesheet"></link><!--Bootstrapp css-->
  <script src="lib/bootstrap/js/bootstrap.bundle.js" ></script><!--bootstrapp js-->

  <script src="lib/jQuery/jquery-3.6.0.min.js"></script><!--jquery-->

  <link rel="stylesheet" href="lib/bulma/bulma.min.css"><!--Bulma-->

  <link href="css/estilos.css" rel="stylesheet"></link><!--Estilos | Kren.com-->

  <script src="js/script.js"></script><!--Scripts | Kren.com-->
  <script src="js/notify.js"></script><!--Scripts | Kren.com-->

</head>

<body>


  <main>
    <nav class="navbar navbar-dark bg-dark" aria-label="First navbar example">
      <div class="container-fluid">
        <a class="navbar-brand logo-name" href="#">
        <i class="fas fa-kiwi-bird"></i>&nbsp;Kren
        </a>
        <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample01" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">
          <?php echo $user?>
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-collapse collapse" id="navbarsExample01">
          <ul class="navbar-nav me-auto mb-2">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page">Nosotros</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.</a>
            </li>
             <li class="nav-item">
               <a class="nav-link active" aria-current="page">
                <i class="fab fa-facebook"></i>
                <i class="fab fa-twitter"></i>
                <i class="fab fa-whatsapp"></i>
                <span class="cerrar_sesion">
                  <i class="fas fa-power-off"></i> Cerrar sesión
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </main>
  <br>
  <br>
  <div id="contenido" ><!--contenido general-->
     
          
         
     

      <div id="cont-i" ><!--contenido izquierda-->
          <div class="panel-block panel-barra-busqueda"><!--Barra de busqueda-->
              <p class="control has-icons-left btn-group">
                <input class="input is-primary barra-busqueda" type="text" placeholder="">
                <button class="button  is-primary but-barra-busqueda btn_lista_cursos"><i class="far fa-bookmark"></i></button>
                <button class="button  is-primary but-barra-busqueda btn_lista_empleados"><i class="fas fa-users"></i></button>
                <span class="icon is-left">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
                  
              </p>
          </div>




        <ol class="list-group list-group-numbered lista_cursos" ><!--Listado de cursos-->
        </ol>
       
          <div id="curso-detalle" class="">
           <span id="titulo-detalle"></span>
           <span id="ponente" title="Ponente"></span>
             <div id="info">
               
              </div>
              <span class="det_curso">
                <span class="inscritos-detalle badge rounded-pill"></span>
                <span class="fecha_aplicacion badge rounded-pill"></span>
                <span class="hora_aplicacion badge rounded-pill"></span>
              </span>
            <span id="botones-detalle">
              <!--<button type="button" class="btn btn-light iniciar_curso"> <i class="fas fa-edit"></i>Iniciar Curso</button>&nbsp;-->
              <button type="button" class="btn btn-light editar_curso"> <i class="fas fa-edit"></i> Editar</button>&nbsp;
              <button type="button" class="btn btn-warning confirm_borrar_curso"> <i class="fas fa-trash"></i> Borrar</button>
            </span>
          </div>
      </div>
    
      <div id="cont-d" ><!--contenido derecha-->
       <div id="agregar-curso">
         <section class="selector_opc">
           <span class="backcolor" id="plus-agregar">
              <i class="fas fa-plus"></i>
              <br>Crear curso
           </span>
           <span class="backcolor" id="plus-agregar-empleado">
            <i class="fas fa-user-plus"></i>
            <br>Agregar empleado
           </span>
           
         </section>

          <span id="form-agregar-curso" class="span-formularios">
            <form id="form-agregar-curso">
              <span>Nombre del curso</span> <br><input class="input-group-text input is-primary"  name="nombre_curso" type="text" placeholder="Nombre del curso"><br>
               <span>Ponente</span> <br><input class="input-group-text input is-primary"  name="ponente" type="text" placeholder="Ponente"><br>
              <span>Fecha / hora de aplicación</span><br><input class="input-group-text input is-primary fecha_form" name="fecha" type="date" placeholder=""><input class="input-group-text input is-primary fecha_form" name="hora" type="time" placeholder=""><br>
              <span id="cantidad-usuarios-span">Cantidad de usuarios permitidos</span>
              <span class="btn-group">
                <input   class="input-group-text input is-primary u_permitidos" type="number" name="cant_usuarios" placeholder="#">
                <span class="form-check form-switch usu_permitidos">
                  <input class="form-check-input usu_permitidos_switch" type="checkbox" id="flexSwitchCheckDefault"> 
                  Ilimitados
              </span>
              </span>
              <br><span>Descripción del curso</span><br>
              
              <textarea class="is-primary des_form" maxlength="300" placeholder="Descripción del curso" name ="descripcion"></textarea><br>
              <button type="button" class="btn btn-primary crear_curso"  value=""><i class="far fa-plus-square"></i> Crear</button> <button type="button" class="btn btn-primary guardar_cambios"  value="" ><i class="fas fa-save"></i> Guardar</button><button type="button" class="btn btn-warning cerrar-formulario" value=""><i class='fas fa-window-close'></i> Cerrar</button>
            </form>
          </span>

          <span id="form-agregar-empleado" class="span-formularios">
              <form id="form-agregar-empleado">
                  <span>Nombre del empleado</span><br>
                  <input class="input-group-text input is-primary"  name="nombre_empleado" type="text" placeholder="Nombre completo del empleado"><br>

                  <span>Correo</span><br>
                  <input class="input-group-text input is-primary"  name="correo" type="text" placeholder="Correo"><br>
                <span>Fecha de nacimiento  <span id="span-der-form">Area o departamento</span></span><br>
                <input class="input-group-text input is-primary fecha_form" name="fecha_nacimiento" type="date" placeholder=""><input class="input-group-text input is-primary fecha_form" name="area_departamento" type="text" placeholder="Ventas | Almacen"><br>
               
                <section class="span-numero-telefono">
                  <span id="cantidad-usuarios-span">Numero de telefono</span>
                  <input  class="input-group-text input is-primary" type="number" name="telefono" placeholder="+52 312-000-000-000">
                </section>
                <button type="button" class="btn btn-warning button-vincular" name="rfid" id="VincularRFID"><p id="msjRfid"><i id="iconoRFID" class="far fa-id-card"></i>Vincular tarjeta RFID<p><p id="esperaTag">Pase tag por el lector&nbsp;<i><img id="imgEspera" src="img/loading.gif"></i><p></button><br>
                <span>Domicilio del empleado</span><br>
                <input class="input-group-text input is-primary" maxlength="100" placeholder="Colima, Cuauhtemoc Emiliano Zapata #222" name="domicilio"><br>
                <button type="button" class="btn btn-primary agregar_empleado"  value=""><i class="far fa-plus-square"></i> Agregar</button><button type="button" class="btn btn-primary guardar_cambios_empleado"  value="" ><i class="fas fa-save"></i> Guardar</button><button type="button" class="btn btn-warning cerrar-formulario" value=""><i class='fas fa-window-close'></i> Cerrar</button>
              </form>
          </span>

        
      </div>

        <div id="actividad-actual" class="col col-xs-11">
         <center>
           <label id="tit-actividad-actual">
              <i class="fab fa-raspberry-pi"></i> Actividad actual
           </label>
           <br>
           <label id="label-actividad-act" class="col col-md-11">

            </label> 
          <br>
           <button type="button" value="" class="btn btn-light mostrarTiempoReal"><i class="fas fa-eye"></i>Mostrar actividad actual</button>
           <button type="button" value="" class="btn btn-light ocultarTiempoReal"><i class="fas fa-eye"></i>Ocultar actividad actual</button>
         </center><!--Actividad actual-->
      </div>
    </div>
  </div>
<center>
  <footer>
    <span id="cabecera-tit-i"> 
      <img id="logo-raspberry" src="img/raspberry-pi.png"> 
      <span class="text-foot">
        Raspberry Pi
      </span>
    </span>
    <span id="cabecera-tit-d"> 
        <span class="text-foot">
        <i class="fas fa-kiwi-bird"></i> Kren 2021
        </span>
    </span>
  </footer>
</center>
<!--/////////////////////////////////////////////Modales///////////////////////////////////////////////////-->
  
    <div class="modal modal-borrar-curso">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4"><i class="fas fa-trash"></i> Deseas borrar este curso?</p>
              </div>
               <div class="media-right">
                <i class="fas fa-times cerrar_modal" hidden></i>
              </div>
            </div>

           <div class="content">
              <button class="button is-primary is-outlined borrar_curso">Si borrar</button>
              <button class="button is-danger is-outlined cerrar_modal">Cancelar</button> 
              <br>
            </div>
          </div>
        </div>
      </div>
      <!--<button class="modal-close is-large" aria-label="close"></button>-->
    </div>

    <div class="modal modal-exito">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4"></p>
              </div>
               <div class="media-right">
                <i class="fas fa-times cerrar_modal" hidden></i>
              </div>
            </div>

            <div class="content botones-modale-exito">
              <button class="button is-primary is-outlined cerrar_modal">Ok</button> 
              <br>
            </div>
          </div>
        </div>
      </div>
      <!--<button class="modal-close is-large" aria-label="close"></button>-->
    </div>
</body>

</html>







