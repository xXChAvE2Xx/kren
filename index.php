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
  <script href="lib/fontawesome/js/all.min.js" type="text/javascript"></script><!--Fontawesome js h-->
<!--Offline lib-->
  <link rel="stylesheet" href="lib/offline/tema/offline-theme-slide-indicator.css"/></link>
  <link rel="stylesheet" href="lib/offline/lenguaje/offline-language-spanish-indicator.css"/></link>
<!-- Fin Offline lib-->
  <link rel="stylesheet" href="css/animate.min.css"/><!--Animate.css-->

  <link href="lib/bootstrap/css/bootstrap.min.css" rel="stylesheet"></link><!--Bootstrapp css-->
  <script src="lib/bootstrap/js/bootstrap.bundle.js" ></script><!--bootstrapp js-->

  <script src="lib/jQuery/jquery-3.6.0.min.js"></script><!--jquery-->

  <link href="lib/datatable/css/jquery.dataTables.min.css" rel="stylesheet"></link><!--datatables css-->
  <script src="lib/datatable/js/jquery.dataTables.min.js" ></script><!--datatables js-->
  <script src="lib/datatable/fixedcolumns/js/fixedColumns.dataTables.min.js" ></script><!--datatables js-->
  <link rel="stylesheet" href="lib/datatable/fixedcolumns/css/fixedColumns.dataTables.min.css" ><!--datatables css-->

  <link rel="stylesheet" href="lib/bulma/bulma.min.css"><!--Bulma-->

  <link href="css/estilos.css" rel="stylesheet"></link><!--Estilos | Kren.com-->

  <script src="lib/offline/offline.js"></script>
  <script src="js/script.js"></script><!--Scripts | Kren.com-->
  <script src="js/notify.js"></script><!--Scripts | Kren.com-->
</head>

<body>


  <main>
    <nav class="navbar navbar-dark bg-dark menu" aria-label="First navbar example">
      <div class="container-fluid">
        <a class="navbar-brand logo-name" href="#">
        <i class="fas fa-kiwi-bird"></i>&nbsp;Kren
        </a>
        <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample01" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-user-cog has-text-primary"></i>&nbsp;<?php echo $user?>
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-collapse collapse" id="navbarsExample01">
          <ul class="navbar-nav me-auto mb-2">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page">
                <center><font align="jusify">Nosotros</font></center>
              </a>
                <span class="has-text-warning subtitle is-5">
                  <center class="lema">
                      Un grupo de aficionados a la programacón y amor por hacer las cosas mas faciles, con un enfoque tecnologico en todo lo que hacemos.
                    <br>
                    
                      <i class="icon has-text-danger fas fa-hand-holding-heart"></i><span class="has-text-light subtitle is-5">+</span><i class="icon has-text-success fas fa-code"></i><span class="has-text-light subtitle is-5">=</span><span class="has-text-primary subtitle is-5 ">Kren</span>
                 
                  </center>
                </span>
             
            </li>
             <li class="nav-item">
                <a class="nav-link active controles_main" aria-current="page">
                  <!-- <i class="fab fa-facebook"></i>&nbsp;&nbsp;
                  <i class="fab fa-twitter"></i>&nbsp;&nbsp;
                  <i class="fab fa-whatsapp"></i> -->
                  <i class="button iredes is-warning"><i class="fab fa-facebook"></i>&nbsp;<i class="fab fa-twitter"></i>&nbsp;<i class="fab fa-whatsapp"></i></i>
                  <i class="button cerrar_sesion  is-warning"><i class="fas fa-power-off"></i>&nbsp;Cerrar sesión </i>
                </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </main>
  <br>
  <br>
  <div id="contenido"><!--contenido general-->
     
          
         
     

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
       
          <div id="curso-detalle" class="animate__animated">
           <span id="titulo-detalle" class="animate__animated curso-detalle-elementos" title="Titulo del curso"></span>
           <span id="ponente" class="animate__animated curso-detalle-elementos" title="Ponente"></span>
             <div id="info" class="animate__animated curso-detalle-elementos" title="Descripción del curso"></div>
            
                <span class="det_curso">
                    <span class="fecha_hora_inicio badge rounded-pill curso-detalle-elementos"></span>
                    <span class="fecha_hora_fin badge rounded-pill curso-detalle-elementos"></span>
                </span>
                <span id="botones-detalle">
                  <!--<button type="button" class="btn btn-light iniciar_curso"> <i class="fas fa-edit"></i>Iniciar Curso</button>&nbsp;-->
                    <!--boton para desktop-->
                    <button type="button" class="btn btn-light editar_curso" title="Editar este curso"> <i class="fas fa-edit"></i> Editar</button>&nbsp;
                    <!--boton para dispositivos moviles-->
                    <button type="button" class="btn btn-light editar_curso_movile" title="Editar este curso"> <i class="fas fa-edit"></i> EditarM</button>&nbsp;

                  <button type="button" class="btn btn_warning_own confirm_borrar_curso" title="Borrar este curso"> <i class="fas fa-trash"></i> Borrar</button>
                </span>
              
          </div>
      </div>
    
      <div id="cont-d" ><!--contenido derecha-->
       <div id="agregar-curso" class="animate__animated">
        <div class="selector_opc opciones_desktop">
          <!--botones para desktop-->
          <span class="backcolor" id="plus-agregar">
           <i class="fas fa-plus"></i><br>Crear curso
          </span>
          <span class="backcolor" id="plus-agregar-empleado">
           <i class="fas fa-user-plus"></i><br>Agregar empleado
          </span>
          <span class="backcolor" id="listado_asistencias">
            <i class="fas fa-list"></i><br>Asistencias
          </span>
        </div>
        <div class="selector_opc opciones_movile" hidden>
          <!--botones para dispositivos moviles-->
          <span class="backcolor" id="plus-agregar-movile">
           <i class="fas fa-plus"></i><br>Crear cursoM
          </span>
          <span class="backcolor" id="plus-agregar-empleado-movile">
           <i class="fas fa-user-plus"></i><br>Agregar empleadoM
          </span>
          <span class="backcolor" id="listado_asistencias-movile">
            <i class="fas fa-list"></i><br>AsistenciaM
          </span>
        </div>

          <span id="form-agregar-curso" class="span-formularios">
            <form id="form-agregar-curso">
              <span>Nombre del curso</span> <br><input class="input-group-text input is-primary"  name="nombre_curso" type="text" placeholder="Nombre del curso"><br>
               <span>Ponente</span> <br><input class="input-group-text input is-primary"  name="ponente" type="text" placeholder="Ponente"><br>
              <span id="cantidad-usuarios-span"><center>Tomar este curso la proxima vez?</center></span>
              <center>
                <span class="btn-group">
                  No&nbsp;
                  <span class="form-check form-switch usu_permitidos">
                    <input class="form-check-input siguiente_switch" type="checkbox" id="flexSwitchCheckDefault"> 
                    Si
                  </span>
                </span>
              </center>
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
                  <input  class="input-group-text input is-primary" type="number"  name="telefono" placeholder="+52 312-000-000-000">
                </section>
                <button type="button" class="btn btn-warning button-vincular" name="rfid" id="VincularRFID"><p id="msjRfid"><i id="iconoRFID" class="far fa-id-card"></i>Vincular tarjeta RFID<p><p id="esperaTag">Pase tag por el lector&nbsp;<i><img id="imgEspera" src="img/loading.gif"></i><p></button><br>
                <span>Domicilio del empleado</span><br>
                <input class="input-group-text input is-primary" maxlength="100" placeholder="Colima, Cuauhtemoc Emiliano Zapata #222" name="domicilio"><br>
                <button type="button" class="btn btn-primary agregar_empleado"  value=""><i class="far fa-plus-square"></i> Agregar</button><button type="button" class="btn btn-primary guardar_cambios_empleado"  value="" ><i class="fas fa-save"></i> Guardar</button><button type="button" class="btn btn-warning cerrar-formulario" value=""><i class='fas fa-window-close'></i> Cerrar</button>
              </form>
          </span>

        
      </div>

        <div id="actividad-actual" class="col col-xs-11 animate__animated">
          <center>
            <label id="tit-actividad-actual" title="Aqui se muestra lo que esta sucediendo actualmente en el dispositivo">
                <i class="fab fa-raspberry-pi"></i> Actividad actual
            </label>
            <br>
            <label id="label-actividad-act" class="col col-md-11 animate__animated">

              </label> 
            <br>
            <button type="button" value="" class="button btn-light mostrarTiempoReal is-rounded"><i class="fas fa-eye"></i>&nbsp;Mostrar actividad actual</button>
            <button type="button" value="" class="button btn-light ocultarTiempoReal is-rounded"><i class="far fa-eye-slash"></i>&nbsp;Ocultar actividad actual</button>
          </center><!--Actividad actual-->
        </div>

         <!-----------------Tabla asistencias----------------->
         <table id="example" class="stripe row-border order-column nowrap" style="width:100%; height:100% !important; ">
          <thead>
              <tr>
                  <th>Empleado</th>
                  <th>Area</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Constancias</th>
              </tr>
          </thead>
          <tbody>
              <!--<tr><td>Marcelo Ramirez Morfin</td><td>Sistemas</td><td>'2021-09-24 15:45:25'</td><td>'2021-09-24 15:45:28'</td></tr>-->
              
              
          </tbody>
        </table>


    </div>
  </div>
  <!-------------------------------------Contenido para dispositivos moviles------------------------------------->
  <!--listado asistencias movile-->
  <div id="listado_asistencias_para_moviles" class="contenidos_disp_moviles animate__animated">

  </div>
  <!--Formulario para cursos movile-->
  <div id="formulario_cursos_para_moviles" class="contenidos_disp_moviles formularios_moviles animate__animated">
    <form id="form-agregar-curso_movile" class="formularios_movile">
      <span>Nombre del curso</span> <br><input class="input-group-text input is-rounded is-primary"  name="nombre_curso_movile" type="text" placeholder="Nombre del curso"><br>
        <span>Ponente</span> <br><input class="input-group-text input is-rounded is-primary"  name="ponente_movile" type="text" placeholder="Ponente"><br><br>
      <span id="cantidad-usuarios-span"><center>Tomar este curso la proxima vez?</center></span>
      <center>
        <span class="btn-group">
          No&nbsp;
          <span class="form-check form-switch usu_permitidos">
            <input class="form-check-input siguiente_switch_movile" type="checkbox" id="flexSwitchCheckDefault"> 
            Si
          </span>
        </span>
      </center>
      <br><span>Descripción del curso</span><br>
      
      <textarea class="is-primary des_form" maxlength="300" placeholder="Descripción del curso" name ="descripcion_movile"></textarea><br>
      <button type="button" class="btn btn_primary_own crear_curso_movile"  value=""><i class="far fa-plus-square"></i> Crear</button> <button type="button" class="btn btn_primary_own guardar_cambios_movile"  value="" ><i class="fas fa-save"></i> Guardar</button><button type="button" class="btn btn_warning_own cerrar-formulario-movile" value=""><i class='fas fa-window-close'></i> Cerrar</button>
    </form>
  </div>

  <!--Formulario para empleados movile-->
  <div id="formulario_empleados_para_moviles" class="contenidos_disp_moviles formularios_moviles animate__animated">
    <form id="form-agregar-empleado-movile" class="formularios_movile">
      <span>Nombre del empleado</span><br>
      <input class="input-group-text input is-rounded is-primary"  name="nombre_empleado_movile" type="text" placeholder="Nombre completo del empleado"><br>

      <span>Correo</span><br>
      <input class="input-group-text input is-rounded is-primary"  name="correo_movile" type="text" placeholder="Correo"><br>
      <span>Fecha de nacimiento</span><br>
      <input class="input-group-text input is-rounded is-primary" name="fecha_nacimiento_movile" type="date" placeholder=""><br>
      <span>Area o departamento</span><br>
      <input class="input-group-text input is-rounded is-primary" name="area_departamento_movile" type="text" placeholder="Ventas | Almacen"><br>
      
      <span id="cantidad-usuarios-span">Numero de telefono</span><br>
      <input  class="input-group-text input is-rounded is-primary" type="number"  name="telefono_movile" placeholder="+52 312-000-000-000">
     
      <button type="button" class="btn btn_warning_own button-vincular-movile" name="rfid" id="VincularRFID_movile"><p id="msjRfid"><i id="iconoRFID" class="far fa-id-card"></i>Vincular tarjeta RFID<p><p id="esperaTag">Pase tag por el lector&nbsp;<i><img id="imgEspera" src="img/loading.gif"></i><p></button><br>
      <span>Domicilio del empleado</span><br>
      <input class="input-group-text input is-rounded is-primary" maxlength="100" placeholder="Colima, Cuauhtemoc Emiliano Zapata #222" name="domicilio_movile"><br>
      <button type="button" class="btn btn_primary_own agregar_empleado_movile"  value=""><i class="far fa-plus-square"></i> Agregar</button><button type="button" class="btn btn_primary_own guardar_cambios_empleado_movile"  value="" ><i class="fas fa-save"></i> Guardar</button><button type="button" class="btn btn_warning_own cerrar-formulario-movile" value=""><i class='fas fa-window-close'></i> Cerrar</button>
    </form>   
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
    <!--MODAL BORRAR CURSO-->
    <div class="modal modal-borrar-curso">
      <div class="modal-background"></div>
      <div class="modal-content modal_centrado">
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
    </div>
    <!--MODAL BORRAR EMPLEADO-->
    <div class="modal modal-borrar-empleado">
      <div class="modal-background"></div>
      <div class="modal-content  modal_centrado">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4"><i class="fas fa-user-minus"></i> Deseas borrar este empleado?</p>
              </div>
               <div class="media-right">
                <i class="fas fa-times cerrar_modal" hidden></i>
              </div>
            </div>

           <div class="content">
              <button class="button is-primary is-outlined borrar_empleado">Si borrar</button>
              <button class="button is-danger is-outlined cerrar_modal">Cancelar</button> 
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL NOTIFICACION CONSTANCIAS -->
    <div class="modal modal-constancia">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Creando constancias y comprimiendolas, por favor no cierre la ventana hasta su archivo se haya descargado.</p>
                <img src="img/wait_constancia.gif">
              </div>
               <div class="media-right">
                <i class="fas fa-times cerrar_modal" hidden></i>
              </div>
            </div>
           <div class="content">
              <button class="button is-primar is-outlined cerrar_modal">Entendido</button> 
              <br>
            </div>
          </div>
        </div>
      </div>
      <!--<button class="modal-close is-large" aria-label="close"></button>-->
    </div>
    <!-- FIN MODAL NOTIFICACION CONSTANCIAS -->

    <!--MODAL EXITO-->
    <div class="modal modal-exito">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4"></p>
              </div>
            </div>
            <div class="content botones-modales">
              <button class="button is-primary is-outlined cerrar_modal">Ok</button> 
              <br>
            </div>
          </div>
        </div>
      </div>
      <!--<button class="modal-close is-large" aria-label="close"></button>-->
    </div>

    <!--MODAL ASISTENCIA-->
    <div class="modal modal-asistencia">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
               <p class="modal-card-title"></p>
                <span id="info"></span>
                <div id="cont_tabla">
                  <table class="table" id="tabla_en_sa">
                    <thead>
                      <tr>
                        <th><span class="tag is-success">ENTRADA</span></th>
                        <th><span class="tag is-warning">SALIDA</span></th>
                      </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="content botones-modales">
              <button class="button is-primary is-outlined"><i class="fas fa-download"></i>&nbsp;Descargar Constancia</button>
              <button class="button is-warning  cerrar_modal">Cerrar</button>
              <br>
            </div>
          </div>
        </div>
      </div>

</body>
</html>






