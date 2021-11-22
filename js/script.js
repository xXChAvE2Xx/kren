$(document).ready(function () {

    //variable para rellenar el listado de una u otra manera
    let listado_version_movile = false;
    let estado_lista = '';
    let table = '';
    let id_curso_en_detalle = 0;
    let id_curso_en_datatable = 0;
    let id_empleado_en_detalle = 0;
    let id_actual_empleado_en_detalle = 0;
    // Sirve para obtener la fecha en español, esto es para la constancia.
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(); //Objeto fecha, con instancia a Date

    $("#label-actividad-act").hide();
    $(".ocultarTiempoReal").hide();
    $("#esperaTag").hide();



    $("#plus-agregar-movile").on('click',function(){
        //vaciamos formulario
        $("#form-agregar-curso_movile input").val('');
        $("#form-agregar-curso_movile button").removeAttr('rfid');
        $("#form-agregar-curso_movile input.siguiente_switch_movile").prop('checked',false);
        $("#form-agregar-curso_movile textarea").val('');

        
        //ocultamos el contenido
        slideOutRight_moviles("div#contenido");
        //ocultamos botones innecesarios
        $('button.guardar_cambios_movile').hide();
        $('button.crear_curso_movile').show();
        //mostramos el formulario en version para moviles
        setTimeout(function(){
            slideInRight_moviles("#formulario_cursos_para_moviles");
        },500);
       
    });

    $(".editar_curso_movile").on('click',function(){
        //ocultamos el contenido
        slideOutRight_moviles("div#contenido");
        if(estado_lista == 'cursos'){//proceso para los cursos
            //ocultamos botones innecesarios
            $('button.guardar_cambios_movile').show();
            $('button.crear_curso_movile').hide();
            //rellenamos inputs con datos del curso
            $('input[name="nombre_curso_movile"]').val($("#curso-detalle #titulo-detalle").text());
            $('input[name="ponente_movile"]').val($("#curso-detalle #ponente").text());

            if($("#curso-detalle #titulo-detalle").attr('siguiente')=='1')
                $("input.siguiente_switch_movile").prop('checked', true);
            else
                $("input.siguiente_switch_movile").prop('checked', false);

            $('textarea[name="descripcion_movile"]').val($("#curso-detalle div#info").text());
            //mostramos el formulario en version para moviles
            setTimeout(function(){
            slideInRight_moviles("#formulario_cursos_para_moviles");
            },500);
        }else if(estado_lista == 'empleados'){//proceso para los empleados empleados
            //ocultamos botones innecesarios
            $('button.guardar_cambios_empleado_movile').show();
            $('button.agregar_empleado_movile').hide();
            //rellenamos inputs con datos del curso
            $('input[name="nombre_empleado_movile"]').val($("#curso-detalle #titulo-detalle").text());
            $('input[name="area_departamento_movile"]').val($("#curso-detalle #ponente").text());
            $('input[name="correo_movile"]').val($("#curso-detalle #titulo-detalle").attr('correo'));
            $('input[name="telefono_movile"]').val($("#curso-detalle #titulo-detalle").attr('telefono'));
            $('input[name="fecha_nacimiento_movile"]').val($("#curso-detalle #titulo-detalle").attr('fecha_nac'));
            $('input[name="domicilio_movile"]').val($("#curso-detalle #titulo-detalle").attr('domicilio'));
            if (!$("#curso-detalle #titulo-detalle").attr('rfid')) {
                $('button[name="rfid"]').attr('rfid', $("#curso-detalle #titulo-detalle").attr('rfid'));
                $.notify("El usuario no cuenta con un tag RFID.", "warning");

                $("#VincularRFID_movile").removeClass("btn-danger");
                $("#VincularRFID_movile").removeClass("btn-success");
                $("#VincularRFID_movile").addClass("btn_warning_own");
            }else{
                $('button[name="rfid"]').attr('rfid', $("#curso-detalle #titulo-detalle").attr('rfid'));

                $("#msjActuRFIDmovil").show();
                $("#msjRfidMovil").hide();
                
                $("#VincularRFID_movile").removeClass("btn-danger");
                $("#VincularRFID_movile").removeClass("btn_warning_own");
                $("#VincularRFID_movile").addClass("btn-success");
            }

            //mostramos el formulario en version para moviles
            setTimeout(function(){
            slideInRight_moviles("#formulario_empleados_para_moviles");
            },500);
        }
    });

    $(".guardar_cambios_empleado").click(function(){
       let rfid = $("#VincularRFID").attr("rfid");//$('input.button-vincular').attr('rfid');
       if(rfid == undefined || rfid=='')
            rfid = 0;

        var nombreEmpleado = $("input[name='nombre_empleado']").val();
        var correo = $("input[name='correo']").val();
        var FechaNacimiento = $("input[name='fecha_nacimiento']").val();
        var departamento = $("input[name='area_departamento']").val();
        var telefono = $("input[name='telefono']").val();
        var domicilio = $("input[name='domicilio']").val();
        //Comprobamos que los campos no esten vacíos
        if (nombreEmpleado.trim().length > 0 &&
            correo.trim().length > 0 &&
            FechaNacimiento.length > 0 &&
            departamento.trim().length > 0 &&
            domicilio.trim().length > 0) {

            id_actual_empleado_en_detalle = id_empleado_en_detalle;
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "actualizar_empleado",
                    id_empleado: id_empleado_en_detalle,
                    nombre_empleado:  nombreEmpleado,
                    correo: correo,
                    fecha_nac: FechaNacimiento,
                    area_departamento: departamento,
                    telefono: telefono,
                    domicilio: domicilio,
                    rfid: rfid
                }
            }).done(function (data) {
                if(JSON.parse(data)==true){
                    $("#form-agregar-empleado input").val('');
                    $("button[name=rfid]").removeAttr('rfid');
    
                    $(".cerrar-formulario").click();
    
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado actualizado con exito");
                    $(".modal-exito").show();
    
                    //actualizamos listado
                    $('.list-group li').remove();
                    estado_lista ='';
                    listado_empleados();    
                }
            });
        }else{
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Algunos campos están vacíos, compruebe y vuelva a intentar.");
            $(".modal-exito").show();
        }
    });


    $(".guardar_cambios_movile").on('click',function(){

        var  nombreC = $('input[name="nombre_curso_movile"]').val();
        var ponente = $('input[name="ponente_movile"]').val();
        var descripcion = $('textarea[name="descripcion_movile"]').val();
        var siguiente = $("input.siguiente_switch_movile").prop('checked');
        if (nombreC.trim().length > 0 &&
            ponente.trim().length > 0 &&
            descripcion.trim().length > 0) {
            //peticion para actualizar datos
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "actualizar_curso",
                    id_curso: id_curso_en_detalle,
                    nombre_curso: nombreC,
                    ponente: ponente,
                    descripcion: descripcion,
                    siguiente: siguiente 
                }
            }).done(function (data) {
                if(JSON.parse(data)==true){
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Curso actualizado con exito");
                    $(".modal-exito").show();
                    $("#form-agregar-curso_movile input").val('');
                    $("#form-agregar-curso_movile textarea").val('');
                    $("#form-agregar-curso_movile input.siguiente_switch_movile").prop('checked', false);
                    $(".cerrar-formulario-movile").click();
                }
            });
        }else{
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Algunos campos están vacíos, compruebe y vuelva a intentar.");
            $(".modal-exito").show();
        }
    });


    $("#plus-agregar-empleado-movile").on('click',function(){
        //ocultamos el contenido
        slideOutRight_moviles("div#contenido");
        //ocultamos botones innecesarios
        $('button.guardar_cambios_empleado_movile').hide();
        $('button.agregar_empleado_movile').show();
        //vaciamos formulario
        $('#form-agregar-empleado-movile input').val('');
        $('#form-agregar-empleado-movile button#VincularRFID_movile').removeAttr('rfid');
        //mostramos el formulario en version para moviles
        setTimeout(function(){
            slideInRight_moviles("#formulario_empleados_para_moviles");
        },500);
       
    });

    /*boton crear del formulario de cursos en dispositivos moviles*/
    $(".crear_curso_movile").on('click',function(){
        if ($("input[name='nombre_curso_movile']").val() != '' && $("input[name='ponente_movile']").val() != ''  && $("textarea[name='descripcion_movile']").val() != '') 
        crear_curso(true);
        else {
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
            $(".modal-exito").show();
        }
    });

    /*boton agregar del formulario  de empleados en dispositivos moviles*/
    $(".agregar_empleado_movile").on('click',function(){
        if ($("input[name='nombre_empleado_movile']").val() != '' && $("input[name='correo_movile']").val() != '' && $("input[name='fecha_nacimiento_movile']").val() != '' && $("input[name='area_departamento_movile']").val() != '' && $("input[name='telefono_movile']").val() != '' && $("input[name='domicilio_movile']").val() != '') 
            agregar_empleado(true); 
        else {
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
            $(".modal-exito").show();
        }
    });

    $("button.guardar_cambios_empleado_movile").on('click',function(){
        var nombreEmpleadoMovil = $('input[name="nombre_empleado_movile"]').val();
        var correoMovil = $('input[name="correo_movile"]').val();
        var FechaNacMovil = $('input[name="fecha_nacimiento_movile"]').val();
        var departamentoMv = $('input[name="area_departamento_movile"]').val();
        var telefonoMv = $('input[name="telefono_movile"]').val();
        var domicilioMv = $('input[name="domicilio_movile"]').val();
        var rfidMovil = $('#form-agregar-empleado-movile button[name="rfid"]').attr('rfid');

        if (nombreEmpleadoMovil.trim().length > 0 &&
            correoMovil.trim().length > 0 &&
            FechaNacMovil.length > 0 &&
            departamentoMv.trim().length > 0 &&
            domicilioMv.trim().length > 0) {

            id_actual_empleado_en_detalle = id_empleado_en_detalle;
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "actualizar_empleado",
                    id_empleado: id_empleado_en_detalle,
                    nombre_empleado: nombreEmpleadoMovil,
                    correo: correoMovil,
                    fecha_nac: FechaNacMovil,
                    area_departamento: departamentoMv,
                    telefono: telefonoMv,
                    domicilio: domicilioMv,
                    rfid: rfidMovil
                }
            }).done(function (data) {
                if(JSON.parse(data)==true){
                    $("#form-agregar-empleado-movile input").val('');
                    $("button[name=rfid]").removeAttr('rfid');

                    $(".cerrar-formulario-movile").click();

                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado actualizado con exito");
                    $(".modal-exito").show();

                    //actualizamos listado
                    $('.list-group li').remove();
                    estado_lista ='';
                    listado_empleados();   
                }
            });
        }else{
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Algunos campos están vacíos, compruebe y vuelva a intentar.");
            $(".modal-exito").show();
        }
    });

    //boton del listado de asistencias en version movile
    $("#listado_asistencias-movile").on('click',function(){
        if(estado_lista=='empleados')//si la lista esta en los empleados se redirige a los cursos
            $("button.btn_lista_cursos").click();
        listado_version_movile = true;//activa version movile
        //esconder elementos
        backoutright('#agregar-curso');
        backoutright('#actividad-actual');
        //despues de la animacion llamamos a la funcion que mostrara datatable
        setTimeout(function () {
            listado_asistencias(id_curso_en_detalle);
        }, 400);
    });

   


    $(".cerrar-formulario-movile").on('click',function(){
      

         //ocultamos el contenido
         slideOutRight_moviles(".formularios_moviles");
         //ocultamos botones innecesarios
        // $('button.guardar_cambios_movile').hide();
         //mostramos el formulario en version para moviles
         setTimeout(function(){
             slideInRight_moviles("div#contenido");
         },500);
        

    });
    

    $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente');
    
    //llamamos a la funcion para listar los cursos
    listado_cursos();
    //ocultamos formularios el de cursos se oculta solo en listado_curso()
    $("#form-agregar-empleado").hide();
    


    //muestra los detalles de un curso
    function mostrar_curso_detalle(id_curso) {
        $("button.editar_curso").attr('title','Editar este curso');
        $("button.confirm_borrar_curso").attr('title','Borrar este curso');
        if (id_curso_en_detalle == id_curso) return false;
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "mostrar_curso_detalle",
                id_curso: id_curso
            }
        }).done(function (data) {
           
            /*$("#curso-detalle").addClass('animate__fadeOut');
            setTimeout(function(){ $("#curso-detalle").removeClass('animate__fadeOut');},800)*/

            //coloca el (titulo) en el detalle
            $("#titulo-detalle").text($(".nombre_curso[id_curso=" + id_curso + "]").text());
            //coloca el atributo para saber si este curso es el siguiente
            $("#titulo-detalle").attr('siguiente',JSON.parse(data)[4]);
            //coloca el (ponente) en el detalle
            $("#ponente").html('<i class="fas fa-user-tie"></i> ' + $(".ponente[id_curso=" + id_curso + "]").text());
            //coloca la (descripcion) en el detalle
            $("#info").text(JSON.parse(data)[1]);
            
            //animaciones de entrada
            $("#titulo-detalle,#ponente").addClass('animate__flash');
            setTimeout(function () { $("#titulo-detalle,#ponente").removeClass('animate__flash'); }, 300)


            if(JSON.parse(data)[2] != null){
                $(".fecha_hora_inicio").text('Inicio: ' + JSON.parse(data)[2]);
                $(".fecha_hora_inicio").attr('title','Fecha y hora en que comenzo este curso');

                if(JSON.parse(data)[3] != null)
                {
                     $(".fecha_hora_fin").text('Fin: ' + JSON.parse(data)[3]);
                     $(".fecha_hora_fin").attr('title','Fecha y hora en que finalizo este curso');
                }
                else
                {
                    $(".fecha_hora_fin").text('En proceso de aplicacion');
                    $(".fecha_hora_fin").attr('title','Aun no ha finalizado, este curso');
                }
                $(".fecha_hora_fin").addClass('animate__bounceIn');
                setTimeout(function () { $(".fecha_hora_fin").removeClass('animate__bounceIn'); }, 300)
                
            }else{
                $(".fecha_hora_fin").text('');
                $(".fecha_hora_inicio").text('Aun no se aplica');
                $(".fecha_hora_inicio").attr('title','Aun no se aplica este curso');
                $(".fecha_hora_inicio").addClass('animate__bounceIn');
                setTimeout(function () { $(".fecha_hora_inicio").removeClass('animate__bounceIn'); }, 300)
            }
            
                
            id_curso_en_detalle = id_curso;

        })
    }
    //lista los cursos diponibles
    function listado_cursos() {
        if (estado_lista != 'cursos') {
            $('.list-group').empty();
            estado_lista = 'cursos';
        } else return false;

        //carga listado de cursos
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "listado_cursos"
            }
        }).done(function (data) {
            //mostramos el primer curso en detalle
            //if(JSON.parse(data)[i+3] == 1){
                mostrar_curso_detalle(JSON.parse(data)[1]);
                id_curso_en_detalle = JSON.parse(data)[1];
            //}
            for (var i = 1; JSON.parse(data)[i] != null; i = i + 4) {
                
                //comprueba que no exista el elemento actual
                if ($("li[id_curso=" + JSON.parse(data)[i] + "]").text() == '') {

                    if(JSON.parse(data)[i+3] == 1){
                        $(".list-group").append('<li id_curso="' + JSON.parse(data)[i] + '" agendado="'+JSON.parse(data)[i+3]+'" class="agendado list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold nombre_curso" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 1] + '</div>Ponente: <span class="ponente" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 2] + '</span></div><span class="badge rounded-pill ver-curso" title="Ver el detalle de este curso" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-eye"></i></span><span class="badge rounded-pill agendar_curso" title="Comenzar este curso" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-play"></i></span></li');
                    }else{
                        $(".list-group").append('<li id_curso="' + JSON.parse(data)[i] + '" agendado="'+JSON.parse(data)[i+3]+'" class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold nombre_curso" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 1] + '</div>Ponente: <span class="ponente" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 2] + '</span></div><span class="badge rounded-pill btn_download_asis_masiva" id_curso='+JSON.parse(data)[i]+'><i class="fas fa-scroll"></i></span><span class="badge rounded-pill ver-curso" title="Ver el detalle de este curso" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-eye"></i></span><span class="badge rounded-pill agendar_curso" title="Comenzar este curso" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-play"></i></span></li');
                        $(".iniciar_curso").attr("id_curso", id_curso_en_detalle);
                    }
                }

            }
            

           
            //Descarga de constancias masivas
            $(".btn_download_asis_masiva").on('click',function(){
                var nombre_ventana = "";
                var idcurso = $(this).attr('id_curso');
                var nombre_curso = $("li[id_curso=" + idcurso + "] div.nombre_curso").text();
                var link = ""
                var online = 'down';//Offline.state
                if (online == 'up') {
                    nombre_ventana = "Se enviaron las constancias";
                }else{
                    nombre_ventana = "Se crearon las constancias";
                    $(".modal-constancia").show();
                }
                nombre_ventana += " del curso "+nombre_curso;

                window.open("constancia.php?online="+online+"&idcurso="+idcurso+"&text="+nombre_ventana, nombre_ventana, 'toolbar=0,scrollbars=0,location=0,statusbar=yes,menubar=0,resizable=1,width=360,height=200,left = 390,top = 50');  
            });
             
            

            $(".ver-curso[agendado=1]").click()

            $(".ver-curso").click(function () {

                if ($("#form-agregar-curso").css('display') != 'none' || $("#form-agregar-empleado").css('display') != 'none')
                    $('.cerrar-formulario').click();


                /* $("#agregar-curso").css('background-color', '#6e7275a8');
                 $(".selector_opc").show();*/
                if (id_curso_en_detalle != $(this).attr('id_curso')) {
                    $(".iniciar_curso").attr("id_curso", $(this).attr('id_curso'));
                    mostrar_curso_detalle($(this).attr('id_curso'));
                } else {
                    shake('#curso-detalle');
                }
            });


            $(".agendar_curso").on("click", function(){
                var idcurso = $(this).attr("id_curso")
                $.ajax({
                    method: "POST",
                    data: { axn: "traer_estado" },
                    url: "controladores.php",
                    dataType: 'json'
                }).done(function (validar) {
                    if (validar.boton == 0) {
                        $('.agendado').removeClass('agendado');
                        $("li[id_curso="+idcurso+"]").addClass('agendado');
                        $(".ver-curso[id_curso="+idcurso+"]").click()
                        //agendar el curso, para iniciar 
                        $.ajax({
                            method: "POST",
                            url: "controladores.php",
                            data: {
                                axn: "agendar_curso", 
                                id_curso: idcurso
                            }
                        }).done(function (data) {
                            
                        });
                    } else {
                        $.notify("Un curso está iniciado, por favor deténgalo y presione de nuevo.", "warn");
                    }
                });
                
            });
    
        })
    }
    //muestra el detalle de los empleados
    function mostrar_empleado_detalle(id_empleado){
       
            $("#titulo-detalle").html('<i class="fas fa-user" title="Nombre del empleado"></i> '+$("li[id_empleado="+id_empleado+"] .nombre_empleado").text());
            $("#ponente").html('<i class="fas fa-briefcase" title="Area"></i> '+$("li[id_empleado="+id_empleado+"] .area").text());
            $("button.editar_curso").attr('title','Editar este empleado');
            $("button.confirm_borrar_curso").attr('title','Borrar este empleado');
            
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "info_empleado",
                    id_empleado: id_empleado
                }
            }).done(function (data) {
                var tel = "";
                
                if(JSON.parse(data)[2] == '' || JSON.parse(data)[2] == null)
                    var tel = '<font color="#3dd6af">Sin número telefónico</font>';
                else
                    tel = JSON.parse(data)[2]
                id_empleado_en_detalle = id_empleado;
                //gaurdado de valores en atributos
                $("#titulo-detalle").attr('correo',JSON.parse(data)[4]);
                $("#titulo-detalle").attr('fecha_nac',JSON.parse(data)[3]);
                $("#titulo-detalle").attr('telefono',JSON.parse(data)[2]);
                $("#titulo-detalle").attr('domicilio',JSON.parse(data)[5]);
                $("#titulo-detalle").attr('rfid',JSON.parse(data)[7]);

                //rellenar valores en detalle
                $("#info").empty();
                $("#info").append('<font color="#ffc107">Edad: </font>'+JSON.parse(data)[1]+'');
                $("#info").append('<br><font color="#ffc107">Telefono: </font>'+tel);
                $("#info").append('<br><font color="#ffc107">Fecha de nacimiento: </font>'+JSON.parse(data)[3]);
                $("#info").append('<br><font color="#ffc107">Correo: </font>'+JSON.parse(data)[4]);
                $("#info").append('<br><font color="#ffc107">Domicilio: </font>'+JSON.parse(data)[5]);
                
                if(JSON.parse(data)[7]==''||JSON.parse(data)[7]=='0') 
                    $("#info").append('<br><font color="#ffc107">RFID: </font><font color="#3dd6af">Sin RFID vinculado</font>');
                else
                    $("#info").append('<br><font color="#ffc107">RFID: </font>'+JSON.parse(data)[7]);
                
                $(".det_curso span").text('');
            });
        

    }

    //listado de los empleados
    function listado_empleados() {
        
        if (estado_lista != 'empleados') {
            $('.list-group').empty();
            estado_lista = 'empleados';
        } else return false;
        //carga listado de cursos
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "listado_empleados"
            }
        }).done(function (data) {
           
             id_empleado_en_detalle = JSON.parse(data)[1];
            for (var i = 1; JSON.parse(data)[i] != null; i = i + 3) {
                //comprueba que no exista el elemento actual
                if ($("li[id_empleado=" + JSON.parse(data)[i] + "]").text() == '') {
                    $(".list-group").append('<li id_empleado="' + JSON.parse(data)[i] + '" class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold nombre_empleado" id_empleado="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 1] + '</div>Area: <span class="area" id_empleado="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 2] + '</span></div> <span class="badge rounded-pill ver-empleado" id_empleado="' + JSON.parse(data)[i] + '"><i class="fas fa-eye"></i></span></li');
                }
            }
            //mostramos el primer empleado en detalle
            mostrar_empleado_detalle(JSON.parse(data)[1]);
            if(id_actual_empleado_en_detalle!=0) {   
                //dejamos el mismo usuario que estaba antes de la actualización (osea el mismo que se actuualizo)
                mostrar_empleado_detalle(id_actual_empleado_en_detalle);
                id_actual_empleado_en_detalle = 0;//IMPORTANTE: resetear esta variable a 0
            }
           
            if($(".editar_curso_movile").css('display') == 'inline-block')
            {
                $(".ver-empleado").click(function(){ //funcion para moviles
                    mostrar_empleado_detalle($(this).attr('id_empleado'));
                });
            }else{
                $(".ver-empleado").click(function(){ //funcion para desktop
                    if($("#form-agregar-empleado").css('display')=='block') 
                        $(".cerrar-formulario").click();
                    //mostramos el detalle del empleado correspondiente
                    mostrar_empleado_detalle($(this).attr('id_empleado'));
                });
            }
        })
    }
    //crea un curso nuevo
    function crear_curso(opc) {
        if(opc == false)//si es la version para escritorio
        {
            let nombreCurso = $("input[name='nombre_curso']").val();
            nombreCurso = nombreCurso.trim();
            let ponente = $("input[name='ponente']").val();
            ponente = ponente.trim();
            let siguiente = $('.siguiente_switch').prop('checked');
            let descripcion = $("textarea[name='descripcion']").val();
            descripcion = descripcion.trim();

            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "crear_curso",
                    nombre: nombreCurso,
                    ponente: ponente,
                siguiente: siguiente,
                    descripcion: descripcion
                }
            }).done(function (data) {
                if (JSON.parse(data) == true) {
                    estado_lista = '';
                    listado_cursos();
                    $("#form-agregar-curso input").val('');
                    $("#form-agregar-curso textarea").val('');
                    $(".siguiente_switch").prop('checked',false)
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Curso agregado con exito");
                    $(".modal-exito").show();
                } else {
                    $(".modal-exito .title").html("<i class='fas fa-times'></i> Error al agregar el curso");
                    $(".modal-exito").show();
                }
            })
        }else if(opc == true){//si es la version para dispositivos moviles
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "crear_curso",
                    nombre: $("input[name='nombre_curso_movile']").val(),
                    ponente: $("input[name='ponente_movile']").val(),
                    siguiente: $('.siguiente_switch_movile').prop('checked'),
                    descripcion: $("textarea[name='descripcion_movile']").val()
                }
            }).done(function (data) {
                if (JSON.parse(data) == true) {
                    estado_lista = '';
                    listado_cursos();
                    $("#form-agregar-curso_movile input").val('');
                    $("#form-agregar-curso_movile textarea").val('');
                    $(".siguiente_switch_movile").prop('checked',false)
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Curso agregado con exito");
                    $(".modal-exito").show();
                } else {
                    $(".modal-exito .title").html("<i class='fas fa-times'></i> Error al agregar el curso");
                    $(".modal-exito").show();
                }
            })
        }
    }
    //agrega un nuevo empleado
    function agregar_empleado(opc) {
        if(opc == false)//si es la version para escritorio
        {
            let nombreEmpl = $("input[name='nombre_empleado']").val();
            nombreEmpl = nombreEmpl.trim();
            let correo = $("input[name='correo']").val();
            correo = correo.trim();
            let fechaNac = $("input[name='fecha_nacimiento']").val();
            let areaDep = $("input[name='area_departamento']").val();
            areaDep = areaDep.trim();
            let telefono = $("input[name='telefono']").val();
            let domicilio = $("input[name='domicilio']").val();
            domicilio = domicilio.trim();
            let idRfid = $("#VincularRFID").attr("RFID");

            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "agregar_empleado",
                    nombre: nombreEmpl,
                    correo: correo,
                    fecha_nacimiento: fechaNac,
                    area_departamento: areaDep,
                    telefono: telefono,
                    domicilio: domicilio,
                    id_RFID:idRfid 
                }
            }).done(function (data) {
                var datas = data.trim();
                if (datas == "true") {
                    $("#form-agregar-empleado input").val('');

                    $("#VincularRFID").removeAttr("RFID")
                    $("#VincularRFID").removeClass("btn-success");
                    $("#VincularRFID").addClass("btn-warning");
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado agregado con exito");
                    $(".modal-exito").show();
                    estado_lista = '';
                    listado_empleados();
                } else {
                    $(".modal-exito .title").html("<i class='fas fa-times'></i> Error al agregar el empleado");
                    $(".modal-exito").show();
                }
            }) 
        }else if(opc == true){//si es la version para dispositivos moviles
            if($("#VincularRFID_movile").attr("RFID")==undefined)
            {
                $(".modal-exito .title").html("No has vinculado un RFID, presiona el boton 'Vincular tarjeta RFID' y despues pasa la tarjeta");
                $(".modal-exito").show();
                return false;
            }else{
                let nombreEmplMv = $("input[name='nombre_empleado_movile']").val();
                nombreEmplMv = nombreEmplMv.trim(); //Quita los espacios al inicio
                let correoMv = $("input[name='correo_movile']").val();
                correoMv = correoMv.trim();//Quita los espacios al inicio
                let fechaNacMv = $("input[name='fecha_nacimiento_movile']").val();
                let areaDepMv = $("input[name='area_departamento_movile']").val();
                areaDepMv = areaDepMv.trim();//Quita los espacios al inicio
                let telefonoMv = $("input[name='telefono_movile']").val();
                let domicilioMv = $("input[name='domicilio_movile']").val();
                domicilioMv = domicilioMv.trim();//Quita los espacios al inicio
                let idRfidMv = $("#VincularRFID_movile").attr("RFID");

                $.ajax({
                    method: "POST",
                    url: "controladores.php",
                    data: {
                        axn: "agregar_empleado",
                        nombre: nombreEmplMv,
                        correo: correoMv,
                        fecha_nacimiento: fechaNacMv,
                        area_departamento: areaDepMv,
                        telefono: telefonoMv,
                        domicilio: domicilioMv,
                        id_RFID: idRfidMv
                    }
                }).done(function (data) {
                    var datas = data.trim();
                    if (datas == "true") {
                        $("#form-agregar-empleado-movile input").val('');

                        $("#VincularRFID_movile").removeAttr("RFID")
                        $("#VincularRFID_movile").removeClass("btn-success");
                        $("#VincularRFID_movile").addClass("btn-warning");
                        $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado agregado con exito");
                        $(".modal-exito").show();
                        estado_lista = '';
                        listado_empleados();
                    } else {
                        $(".modal-exito .title").html("<i class='fas fa-times'></i> Error al agregar el empleado");
                        $(".modal-exito").show();
                    }
                }) 
            }
        }  
    }

    function filtrar_listado() {
        var busqueda = $('input.barra-busqueda').val();
        if (estado_lista == 'cursos') {//filtrado para cursos
            $('.list-group li').each(function (index) {
                if ($(this).first().text().replace('Ponente:', '').toLowerCase().indexOf(busqueda.toLowerCase()) >= 0) {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: flex !important");
                } else {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: none !important");
                }
            });
        }
        if (estado_lista == 'empleados') {//filtrado para empleados
            $('.list-group li').each(function (index) {
                if ($(this).first().text().replace('Area:', '').toLowerCase().indexOf(busqueda.toLowerCase()) >= 0) {
                    $('li[id_empleado=' + $(this).attr('id_empleado') + ']').attr("style", "display: flex !important");
                } else {
                    $('li[id_empleado=' + $(this).attr('id_empleado') + ']').attr("style", "display: none !important");
                }
            });
        }
    }

    //Muestra el registro tiempo real
    function tiempo_real() {
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: { axn: 'actualizar_Entradas' },
            dataType: 'text'
        }).done(function (data) {

            if (data.includes('Warning') == true) {
                $("#label-actividad-act").html("<br><section title='Al parecer tienes apagado el dispositivo, o simplemente no haz iniciado un curso...' class='notification disp_desconectado is-warning animate__animated animate__zoomin'><i class='fas fa-plug'></i> Dispositivo desconectado o sin actividad...<i class='fas fa-bed'></i></section>");
                setTimeout(function () { 
                    $('.ocultarTiempoReal').click();
                    $("#label-actividad-act").html('');
                }, 5000)
            } else {
                $("#label-actividad-act").html(data)
            }
        })
    }

    $("#form-agregar-curso").hide();
    $("#plus-agregar").click(function () {
        //reseteamos formulario
        $("input[name='nombre_curso']").val('');
        $("input[name='ponente']").val('');
        $(".siguiente_switch").prop('checked', false);
        $("textarea[name='descripcion']").text('');

        //hacemos scroll para dispositivos moviles
        window.scrollTo(0, 1000);

        $("#agregar-curso").addClass('animate__slideOutRight retardo_formularios');
        setTimeout(function () {
            $(".selector_opc").hide();
            $("#agregar-curso").css('background-color', '#ffffff00');
            $("#agregar-curso").removeClass('animate__slideOutRight retardo_formularios');
            $("#agregar-curso").hide();

            $("button.guardar_cambios").hide();
            $("button.crear_curso").show();
            $("#form-agregar-curso").show();
            $("#agregar-curso").addClass('animate__slideInRight retardo_formularios');
            $("#agregar-curso").show();
            setTimeout(function () { $("#agregar-curso").removeClass('animate__slideInRight retardo_formularios'); }, 300);

        }, 300);




    });
    $("#plus-agregar-empleado").click(function () {
        
        
         $("button.guardar_cambios_empleado").hide();
         $("button.agregar_empleado").show();
       

        window.scrollTo(0, 1000);

        $("#agregar-curso").addClass('animate__slideOutRight retardo_formularios');
        setTimeout(function () {
            $(".selector_opc").hide();
            $("#agregar-curso").css('background-color', '#ffffff00');
            $("#agregar-curso").removeClass('animate__slideOutRight retardo_formularios');
            $("#agregar-curso").hide();

            $("button.guardar_cambios_empleado").hide();
            $("button.agregar_epleado").show();
            $("#form-agregar-empleado").show();
            $("#agregar-curso").addClass('animate__slideInRight retardo_formularios');
            $("#agregar-curso").show();
            setTimeout(function () { $("#agregar-curso").removeClass('animate__slideInRight retardo_formularios'); }, 300);

        }, 300);



    });
    $(".cerrar-formulario").click(function () {

        $("#form-agregar-empleado input").val('');
        $("#VincularRFID").removeAttr("RFID")
        $("#VincularRFID").removeClass("btn-success");
        $("#VincularRFID").removeClass("btn-danger");
        $("#VincularRFID").addClass("btn-warning");


        $("#agregar-curso").addClass('animate__bounceOutRight');
        setTimeout(function () {
            $("#agregar-curso").removeClass('animate__bounceOutRight');
            $(".span-formularios").hide();


            $("#agregar-curso").addClass('animate__bounceInRight');
            $("#agregar-curso").css('background-color', '#1d2f39b5');
            $(".selector_opc").show();
            $("#esperaTag").hide();
            $("#msjRfid").show();
            setTimeout(function () {
                $("#agregar-curso").removeClass('animate__bounceInRight');
            }, 500);

        }, 400);









    });
    $(".confirm_borrar_curso").click(function () {
        if(estado_lista=='cursos'){
            $(".modal-borrar-curso").css('display', 'block');
        }else if(estado_lista=='empleados'){
            $(".modal-borrar-empleado").css('display', 'block');
        }
    });
    $(".borrar_curso").click(function () {
        $(".modal").css('display', 'none');
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "borrar_curso",
                id_curso: id_curso_en_detalle
            }
        }).done(function (data) {
            if (JSON.parse(data) == true) {
                //modal de exito
                $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Curso borrado con exito");
                $(".modal-exito").show();
                //muestra el siguiente curso
                var siguiente = $(".lista_cursos li[id_curso=" + id_curso_en_detalle + "]").next('li').attr('id_curso');
                var anterior = $(".lista_cursos li[id_curso=" + id_curso_en_detalle + "]").prev('li').attr('id_curso');
                if (anterior == '' && siguiente != '') mostrar_curso_detalle(siguiente);
                else
                    if (siguiente == '' && anterior != '') mostrar_curso_detalle(anterior);
                //removemos curso actual
                $(".lista_cursos li[id_curso=" + id_curso_en_detalle + "]").remove();
            }
        })
    });

    $(".borrar_empleado").click(function () {
        $(".modal").css('display', 'none');
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "borrar_empleado",
                id_empleado: id_empleado_en_detalle
            }
        }).done(function (data) {
            if(JSON.parse(data)==true)
            {
                $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado borrado con exito");
                $(".modal-exito").show();
                estado_lista = '';
                listado_empleados();
            }
        })
    });


    $(".cerrar_modal").click(function () {
        $(".modal").css('display', 'none');
    });
    $(".crear_curso").click(function () {
            /*comprobaciones de inoputs vacios*/
            if ($("input[name='nombre_curso']").val() != '' && $("input[name='ponente']").val() != ''  && $("textarea[name='descripcion']").val() != '') 
            crear_curso(false);
            else {
                $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
                $(".modal-exito").show();
            }
    });
    $(".agregar_empleado").click(function () {
        if ($("input[name='nombre_empleado']").val() != '' && $("input[name='correo']").val() != '' && $("input[name='fecha_nacimiento']").val() != '' && $("input[name='area_departamento']").val() != '' && $("input[name='telefono']").val() != '' && $("input[name='domicilio']").val() != '') 
        agregar_empleado(false);
        else {
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
            $(".modal-exito").show();
        }
    });
   


    $('.editar_curso').click(function () {
        if(estado_lista == 'cursos'){//proceso para cursos
            if ($('#form-agregar-curso').css('display') != 'none') { //solo si el formulario ya esta mostrandose
                //solo si el formulario no esta vacio
                if($('input[name=nombre_curso]').val() != ''){
                    shake('#agregar-curso');//hacemos un focus para el usuario
                    return false;
                }else{
                    bouncein('#agregar-curso');
                    //rellenamos los datos correspondientes en el formulario
                    $("input[name='nombre_curso']").val($('span#titulo-detalle').text());
                    $("input[name='ponente']").val($('span#ponente').text());
                    $('textarea.des_form').text($('#info').text());
                    //colocamos los botones correspondientes
                    $("button.guardar_cambios").show();
                    $("button.crear_curso").hide();
                    //checkeamos el switch segun corresponda
                    if($('#titulo-detalle').attr('siguiente')==1)
                        $('.siguiente_switch').prop('checked', true);
                    else
                        $('.siguiente_switch').prop('checked', false);
                    return false;
                }
            }
            //si el datatable esta mostrandoce
        if ($('#example_wrapper').css('display') == 'block')
            $('.ocultar-asistencias').click();//ocultamos el datatable

        window.scrollTo(0, 1000);//scroll para dispositivos moviles
        backoutright("#agregar-curso");//ocultamos el div de los formularios
        //ocultamos los botnes de opciones
        setTimeout(function () {
            $(".selector_opc").hide();
            $("#agregar-curso").css('background-color', '#ffffff00');
         
                $("#form-agregar-curso").show();//mostramos el formulario correspondiente
           

            backinright("#agregar-curso");
        }, 400);

        //reemplazamos los valores correspondientes
        $("input[name='nombre_curso']").val($('span#titulo-detalle').text());
        $("input[name='ponente']").val($('span#ponente').text());
        $('textarea.des_form').text($('#info').text());

        //checkeamos el switch segun corresponda
        if($("#titulo-detalle").attr('siguiente') == '1') 
            $('input.siguiente_switch').prop('checked', true);
        else 
            $('input.siguiente_switch').prop('checked', false);
        
        //botones correspondientes
        $("button.crear_curso").hide();
        $("button.guardar_cambios").show();
    }else if(estado_lista == 'empleados'){//proceso para empleados

        backoutright("#agregar-curso");//ocultamos el div de los formularios

        //rellenamos formulario
        $("input[name='nombre_empleado']").val($('#titulo-detalle').text());
        $("input[name='correo']").val($('#titulo-detalle').attr('correo'));
        $("input[name='area_departamento']").val($('span#ponente').text());
        $("input[name='fecha_nacimiento']").val($('#titulo-detalle').attr('fecha_nac'));
        $("input[name='telefono']").val($('#titulo-detalle').attr('telefono'));
        $("input[name='domicilio']").val($('#titulo-detalle').attr('domicilio'));
     if (!$("#curso-detalle #titulo-detalle").attr('rfid')) {
            $('button[name="rfid"]').attr('rfid', $("#curso-detalle #titulo-detalle").attr('rfid'));
            $("#VincularRFID").removeClass("btn-danger");
            $("#VincularRFID").removeClass("btn-success");
            $.notify("El usuario no cuenta con un tag RFID.", "warning");
            $("#msjActuRFID").hide();
        }else{
            $('button[name="rfid"]').attr('rfid', $("#curso-detalle #titulo-detalle").attr('rfid'));

            $("#msjActuRFID").show();
            $("#msjRfid").hide();
            
            $("#VincularRFID").removeClass("btn-danger");
            $("#VincularRFID").removeClass("btn-warning");
            $("#VincularRFID").addClass("btn-success");
        }
        $("button.agregar_empleado").hide();
        $("button.guardar_cambios_empleado").show();

        //ocultamos botones de opciones
        setTimeout(function () {
            $(".selector_opc").hide();
            $("#agregar-curso").css('background-color', '#ffffff00');
            $("#form-agregar-empleado").show();//mostramos el formulario correspondiente
            
            backinright("#agregar-curso");
        }, 400);

    }

    });


    $('.guardar_cambios').click(function () {

        var nombreCurso = $("input[name='nombre_curso']").val();
        var ponente = $("input[name='ponente']").val();
        var siguiente = $(".siguiente_switch").prop('checked');
        var descripcion = $('.des_form').val(); 

        if (nombreCurso.trim().length > 0 && ponente.trim().length > 0 && descripcion.trim().length > 0) {
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "actualizar_curso",
                    id_curso: id_curso_en_detalle,
                    nombre_curso: $("input[name='nombre_curso']").val(),
                    ponente: $("input[name='ponente']").val(),
                    siguiente: $(".siguiente_switch").prop('checked'),
                    descripcion: $('.des_form').val(),
                }
            }).done(function (data) {
                if (JSON.parse(data) == true) {
                    //actualizamos listado
                    $("li[id_curso=" + id_curso_en_detalle + "] div.nombre_curso").text($("input[name='nombre_curso']").val());
                    $("li[id_curso=" + id_curso_en_detalle + "] span.ponente").text($("input[name='ponente']").val());
                    //actualiza curso detalle
                    var id_curso_guardado = id_curso_en_detalle;
                    id_curso_en_detalle = '';
                    $("li[id_curso=" + id_curso_guardado + "] span.ver-curso").click();
                    //modal de exito
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Curso actualizado con exito");
                    $(".modal-exito").show();
                    //vaciamos formulario
                    $("#form-agregar-curso input").val('');
                    $("#form-agregar-curso textarea").val('');
                    //oculta formulario
                    $("#form-agregar-curso").hide();
                    $("#agregar-curso").css('background-color', '#1d2f39b5');
                    $(".selector_opc").show();
                }
            })
        }else{
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Algunos campos están vacíos, compruebe y vuelva a intentar.");
            $(".modal-exito").show();
        } 
    });
    $(".btn_lista_empleados").click(function () {
        if($("#example_wrapper").css('display')!='none')$("button.boton-volver-asistencias").click();//oculta las asistencias si estan mostrandose y si le dan click al boton de empleados
        $('input.barra-busqueda').attr('placeholder', 'Buscar empleado ó area');
        listado_empleados();
        if($('#form-agregar-curso').css('display') == 'block') $('button.cerrar-formulario').click();
    });
    $(".btn_lista_cursos").click(function () {
        id_curso_en_detalle = '';
        $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente')
        listado_cursos();
        if($('#form-agregar-empleado').css('display') == 'block') $('button.cerrar-formulario').click();
    });
    $("input.barra-busqueda").keyup(function () {
        filtrar_listado();
    });
    //version para escritorio
    $("#VincularRFID").on("click", function () {

        $.ajax({
            method: "POST",
            data: { axn: "traer_estado" },
            url: "controladores.php",
            dataType: 'json'
        }).done(function (validar) {

            if (validar.boton == 0 && validar.web == 0) {
                $("#msjRfid").hide();
                $("#msjActuRFID").hide();
                $("#esperaTag").show();
                $.ajax({
                    method: "POST",
                    url: "controladores.php",
                    data: {
                        axn: "traer_id_rfid",
                    },
                    dataType: 'json'
                }).done(function (data) {
                    var id = data.id.trim();
                    if(data.estado == true){
                        $("#VincularRFID").attr("RFID", id)
                        $("#VincularRFID").removeClass("btn-danger");
                        $("#VincularRFID").removeClass("btn-warning");
                        $("#VincularRFID").addClass("btn-success");
                        $.notify("Se agrego el ID: " + id, "success");
                        $("#esperaTag").hide();
                        $("#msjRfid").show();
                        $(".agregar_empleado").prop('disabled', false);
                    }else{
                        $("#VincularRFID").removeClass("btn-danger");
                        $("#VincularRFID").addClass("btn-danger");
                        $.notify("Tag RFID en uso por otro usuario", "warn");
                        $("#esperaTag").hide();
                        $("#msjRfid").show();
                        $(".agregar_empleado").prop('disabled', true);
                        
                    }
                })
            } else {
                $("#VincularRFID").removeClass("btn-warning");
                $("#VincularRFID").addClass("btn-danger");
                $.notify("Lector RFID en uso", "warn");
            }
        })
    });
   
    //Version Mobile
    $("#VincularRFID_movile").click(function(){       
        $.ajax({
            method: "POST",
            data: { axn: "traer_estado" },
            url: "controladores.php",
            dataType: 'json'
        }).done(function (validar) {

            if (validar.boton == 0 && validar.web == 0) {
                
                $("#msjRfidMovil").hide();
                $("#msjActuRFIDmovil").hide();
                $("#esperaTagMovil").show();

                $.ajax({
                    method: "POST",
                    url: "controladores.php",
                    data: {
                        axn: "traer_id_rfid",
                    },
                    dataType: 'json'
                }).done(function (data) {
                    var id = data.id.trim();
                    if(data.estado == true){
                        $("#VincularRFID_movile").attr("RFID", id)
                        $("#VincularRFID_movile").removeClass("btn-danger");
                        $("#VincularRFID_movile").removeClass("btn-warning");
                        $("#VincularRFID_movile").addClass("btn-success");
                        $.notify("Se agrego el ID: " + id, "success");
                        $("#esperaTagMovil").hide();
                        $("#msjRfidMovil").show();
                        $(".agregar_empleado").prop('disabled', false);
                    }else{
                        $("#VincularRFID_movile").removeClass("btn-danger");
                        $("#VincularRFID_movile").addClass("btn-danger");
                        $.notify("Tag RFID en uso por otro usuario", "warn");
                        $("#esperaTagMovil").hide();
                        $("#msjRfidMovil").show();
                        $(".agregar_empleado").prop('disabled', true);
                        
                    }
                })
            } else {
                $("#VincularRFID_movile").removeClass("btn-warning");
                $("#VincularRFID_movile").addClass("btn-danger");
                $.notify("Lector RFID en uso", "warn");
            }
        })
    });


    var tiempoReal = "";
    $(".mostrarTiempoReal").on("click", function () {
        $("#label-actividad-act").show();
        $(".ocultarTiempoReal").show();
        $(".mostrarTiempoReal").hide();
        //Inciamos la actualizacion, cada medio segundo
        tiempoReal = setInterval(function () { tiempo_real(); }, 500);
    });

    $(".ocultarTiempoReal").on("click", function () {
        $("#label-actividad-act").hide()
        $(".ocultarTiempoReal").hide();
        $(".mostrarTiempoReal").show();
        //Inciamos la actualizacion, cada segundo
        clearInterval(tiempoReal);
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "borrar_Act_Act",
            }
        }).done(function (data) {

        })
    });


    $(".cerrar_sesion").on("click", function () {
        $.post('csesion.php', function (data) { if (data != '') location.reload(); });
    });

    /*--------------------------------------------------------------------SCRIPT NEWS-------------------------------------------------------------*/


    //genera el datatable
    function generar_datatable() {
        table = $('#example').DataTable({
            lengthMenu: [25],
            scrollY: "59vh",
            scrollX: true,
            scrollCollapse: true,
            paging: true,
            fixedHeader: true,
            fixedColumns: {
                left: 1,
                right: 1
            },
            language: {
                "decimal": "",
                "emptyTable": "<i class='fas fa-users-slash'></i> Este curso aun no tiene asistencias",
                "info": " &nbsp; _TOTAL_ Asistencias",
                "infoEmpty": " &nbsp; 0 Coincidencias",
                "infoFiltered": "(Filtrado de _MAX_ asistencias totales)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "<button class='button is-primary boton-volver-asistencias ocultar-asistencias controles_datatable control_iz_datatable'><i class='fas fa-arrow-left'></i>&nbsp;&nbsp;Volver</button>",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });

        $(".dataTables_filter input").attr('placeholder', 'Buscar');
        $(".dataTables_filter input").addClass('input is-primary');
    }

    //cambia color del li seleccionado
    function fun__estilos_li_seleccionado() {

        $('li.list-group-item').click(function () {
            if ($('#example_wrapper').css('display') != 'none') {
                $('li.lista_seleccionado').removeClass('lista_seleccionado');
                $(this).addClass('lista_seleccionado');
            }
        });
    }

    //oculta el datatable
    function fun_volver_datatable() {
        $(".ocultar-asistencias").click(function () {
            //esconde asistencias
            $('#example_wrapper').addClass('animate__animated animate__backOutRight');
            setTimeout(
                function () {
                    //resetear elementos
                    $('#example_wrapper').hide();
                    $('#example_wrapper').removeClass('animate__backOutRight');

                    //muestra apartado agregar curso y empleado
                    $('#agregar-curso').show();
                    $('#agregar-curso').addClass('animate__backInRight');
                    setTimeout(
                        function () {
                            //resetear elementos
                            $('#agregar-curso').removeClass('animate__backInRight');
                        }, 1000);

                    //muestra actividad actual
                    $('#actividad-actual').show();
                    $('#actividad-actual').addClass('animate__backInRight');
                    setTimeout(
                        function () {
                            //resetear elementos
                            $('#actividad-actual').removeClass('animate__backInRight');
                        }, 1000);
                }, 400);
            $('.lista_cursos li').removeClass('cursor');
            $('li.lista_seleccionado').removeClass('lista_seleccionado');
        });
    }

    //selecciona un li
    function fun_seleccionar_li(id_curso_a_actualizar) {
        $('.lista_cursos li').removeClass('lista_seleccionado');
        $('.lista_cursos li').removeClass('cursor');

        setTimeout(function () {
            $('.lista_cursos li[id_curso=' + id_curso_a_actualizar + ']').addClass('lista_seleccionado');
            $('.lista_cursos li').addClass('cursor');
            $('.cursor').click(function () {
                let id = $(this).attr("id_curso");
                mostrar_curso_detalle(id);

                if ($('#example_wrapper').css('display') == 'block')//solo si esta mostrado el listado de asistencias
                {
                    actualizar_datatable($(this).attr('id_curso'));
                }
            });
        }, 100)

    }


    function fun_btn_info_asistencia(){
        $(".btn_info_asistencia").on('click',function(){
            let area = $(this).attr('area');
            let empleado = $(this).attr('empleado');
            let curso = $("li.lista_seleccionado div.nombre_curso").text();
            //recuperacion de asistencias de un usuario en especifico en un curso especifico
            $.ajax({
                method: "POST",
                url: "controladores.php",
                data: {
                    axn: "asistencias_empleado_curso_especifico",
                    id_empleado: $(this).attr('id_empleado'),
                    id_curso: id_curso_en_detalle
                }
            }).done(function (data) {
               
                if(data != 'ERROR')
                {
                    //JSON.parse(data);
                    $(".modal-asistencia .modal-card-title").html('<b><i class="fas fa-info-circle"></i>&nbsp;Información de asistencias</b>'); 
                    $(".modal-asistencia span#info").html("<br>Empleado:&nbsp;"+empleado+"<br>Area:&nbsp;"+area);
                    $(".modal-asistencia span#info").append("<br>Curso:&nbsp;"+curso);
                    $(".modal-asistencia tbody").empty();
                    $("#ConstanciaDownload").attr("nombre", empleado);
                    
                    let tamaño = JSON.parse(data).length/2;
                    for(let i=0;i<tamaño;i++){
                        $(".modal-asistencia tbody").append("<tr><th>"+JSON.parse(data)[i]+"</th><th>"+JSON.parse(data)[i+1]+"</th></tr>");
                    }
                  


                    $(".modal-asistencia").show();
                }
               
            });

           
        });
    }


    //-------------------------------------------------------------------Animaciones--------------------------------------------------------------*/

    //realiza un focus para el usuario (con animacion)
    function shake(selector) {
        $(selector).addClass('animate__headShake');
        setTimeout(function () {
            $(selector).removeClass('animate__headShake');
        }, 700);
    }

    //muestra el datatable (con animacion)
    function bounce_inright_datatable() {
        $('#example').show();
        $('#example_wrapper').show();
        $('#cont-d').addClass('animate__animated animate__bounceInRight');
        $('#cont-d').show();

        setTimeout(function () {

            $('#cont-d').removeClass('animate__animated animate__bounceInRight');
        }, 800);
    }

    //oculta elementos hacia la derecha
    function backoutright(selector) {
        $(selector).addClass('animate__backOutRight');
        setTimeout(
            function () {
                //resetear elemento
                $(selector).hide();
                $(selector).removeClass('animate__backOutRight');
            }, 400
        );
    }

    //oculta elementos hacia la derecha (solo funciona en dispositivos moviles)
    function slideOutRight_moviles(selector){
        $(selector).addClass('animate__slideOutRight_own');
        setTimeout(function(){
            $(selector).hide();
            $(selector).removeClass('animate__slideOutRight_own');
        },500);
    }

    //muestra elementos desde la izquierda (solo funciona en dispositivos moviles)
    function slideInRight_moviles(selector){
        $(selector).show();
        $(selector).addClass('animate__slideInRight_own');
        setTimeout(function(){
            $(selector).removeClass('animate__slideInRight_own');
        },500);
    }

    //muestra elementos con animacion desde la derecha
    function backinright(selector) {
        $(selector).show();
        $(selector).addClass('animate__backInRight retardo_formularios');
        setTimeout(
            function () {
                //resetear elemento
                $(selector).removeClass('animate__backInRight retardo_formularios');
            }, 300
        );
    }

    function bouncein(selector){
        $(selector).addClass('animate__bounceIn');
        setTimeout(
            function () {
                //resetear elemento
                $(selector).removeClass('animate__bounceIn');
            }, 800
        );
    }




    let esta=0;
    //optimizada
    //llena del datatable
    function llenado_datatable(id_curso_a_mostrar) {
        if(listado_version_movile == true)//verificamos la version (moviles/desktop) para intercambiar la cabecera de la tabla
        {
            $("table#example thead").html('<tr><th>Empleado</th><th>Opciones</th></tr>');
        }
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "asistencias",
                id_curso: id_curso_a_mostrar
            }
        }).done(function (data) {
            id_curso_en_datatable = id_curso_a_mostrar;//actualiza la variable del id del curso mostrado en el datatable
            let i = 0;
            let id_empleado = 0;
            while (i < JSON.parse(data).length){//recorre todos los valores del JSON
                if(JSON.parse(data)!='ERROR')
                {
                    //if(listado_version_movile == true){//verificamos la version (moviles/desktop) para intercambiar llenado del datatable
                        if(id_empleado != JSON.parse(data)[i])
                        {
                            $("table#example tbody").append('<tr><td>' + JSON.parse(data)[i + 1] + '</td><td><button area="'+JSON.parse(data)[i + 2]+'" empleado="'+JSON.parse(data)[i + 1]+'" id_empleado="'+JSON.parse(data)[i]+'" class="button is-rounded is-primary btn_info_asistencia"><i class="fas fa-chevron-right"></i></button></td></tr>');
                            id_empleado = JSON.parse(data)[i];
                        }

                    //}else
                   //     $("table#example tbody").attr('<tr><td>' + JSON.parse(data)[i + 1] + '</td><td>' + JSON.parse(data)[i + 2] + '</td><td><span class="tag is-success" title="Fecha y hora de entrada de esta asistencia">'+JSON.parse(data)[i + 3]+'</span></td><td><span class="tag is-danger" title="Fecha y hora de salida de esta asistencia">'+JSON.parse(data)[i + 4]+'</span></td><td><button  class="button is-rounded is-primary btn_download_constancia"><i class="fas fa-download"></i></button></td></tr>');
                }
                i = i + 5;

                let hoyEsp = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();

                $("table#example tbody").attr("fecha",hoyEsp);

                if (i == JSON.parse(data).length) {//si ya se termino de rellenar el datatable
                    $('table').show();

                    if ($('#example_wrapper').length == 0) {//si no existe un datatable actualmente
                        


                        $(".btn_download_constancia").on('click',function(){//descargar asistencias

                            var nombre = $(this).parent().prev().prev().prev().prev().text();
                            var nom_curso = $('div.nombre_curso[id_curso='+id_curso_en_datatable+']').text();
                            var entrada = $(this).parent().prev().prev().text();
                            var salida = $(this).parent().prev().text();
                            var area  = $(this).parent().prev().prev().prev().text();
                            window.open("constancia.php?nombre="+nombre+"&entrada="+entrada+"&nom_curso="+nom_curso+"&salida="+salida+"&area="+area, 'Constancia de '+nombre, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50');

                           
                        });

                        //genera el datatable
                        generar_datatable();
                        //declara la funcion que cambia los estilos del li cuando es clickeado
                        fun__estilos_li_seleccionado();
                        //mostrar datatable con animacion
                        bounce_inright_datatable();
                        //declara la funcion para el boton volver
                        fun_volver_datatable();
                        //selecciona el li correspondiente
                        fun_seleccionar_li(id_curso_a_mostrar);
                        //declara funcion onclick del boton para ver informacionde asistencia
                        fun_btn_info_asistencia();

                    } else {
                        //mostrar datatable con animacion
                        bounce_inright_datatable();
                    }
                    $('.lista_cursos li').removeClass('cursor');
                }
            }
        });
    }

    $("#ConstanciaDownload").click(function(){
        let nom_curso = $('div.nombre_curso[id_curso='+id_curso_en_datatable+']').text();
        let nombreEmpl = $(this).attr("nombre");
        nombreEmpl = nombreEmpl.trim();
        let fecha = $("table#example tbody").attr("fecha");

        window.open("constancia.php?nombre="+nombreEmpl+"&fecha="+fecha+"&nom_curso="+nom_curso, 'Constancia de '+nombreEmpl, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50');
    });


    //optimizada
    //click para boton asistencias
    $("#listado_asistencias").click(function () {
        //esconder elementos
        backoutright('#agregar-curso');
        backoutright('#actividad-actual');
        //despues de la animacion llamamos a la funcion que mostrara datatable
        setTimeout(function () {
            listado_asistencias(id_curso_en_detalle);
        }, 400);
    });

    //optimizada
    function actualizar_datatable(id_curso_a_actualizar) {
        if (id_curso_a_actualizar != id_curso_en_datatable) {
            if (table.destroy()) {
                //vaciamos y escondemos datatable
                $("#example tbody").html('');
                $("#example").hide();
                $(".lista_cursos li").removeClass('cursor');

                //rellenamos datatable y lo mostramos
                llenado_datatable(id_curso_a_actualizar);
            }
        } else {
            shake('#example_wrapper');
        }
    }


    //optimizada
    function listado_asistencias(id_curso) {
        //comparamos que no sean iguales los dos cursos (el que se selecciono o el del datatable)
        if (id_curso_en_datatable != id_curso) {
            //rellenamos datatable y lo mostramos
            llenado_datatable(id_curso);
        } else {
            if ($('#example_wrapper').css('display') == 'block') {
                //realizamos un focus al datatable para el usuario
                shake('#example_wrapper');
            } else {
                fun_seleccionar_li(id_curso_en_datatable)
                bounce_inright_datatable();
            }
        }
    }


    $('table').hide();

    /*var run = function(){
      Offline.check();
    }
    setInterval(run, 2000); //Para saber si seguimos en linea tenemos que checar cada 3 segundos*/


}); //fin document-ready