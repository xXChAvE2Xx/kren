$(document).ready(function () {
    $("#label-actividad-act").hide();
    $(".ocultarTiempoReal").hide();
    $("#esperaTag").hide();

    $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente');
    let estado_lista = '';
    let table = '';
    //llamamos a la funcion para listar los cursos
    listado_cursos();
    //ocultamos formularios el de cursos se oculta solo en listado_curso()
    $("#form-agregar-empleado").hide();
    let id_curso_en_detalle = 0;
    let id_curso_en_datatable = 0;


    //muestra los detalles de un curso
    function mostrar_curso_detalle(id_curso) {
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
                var online = Offline.state
                if (online == 'up') {
                    nombre_ventana = "Se enviaron las constancias";
                }else{
                    nombre_ventana = "Se crearon las constancias";
                }
                nombre_ventana += " del curso <strong>"+nombre_curso+"</strong>";
                console.log(nombre_ventana)
                window.open("constancia.php?online="+online+"&idcurso="+idcurso+"&text="+nombre_ventana, nombre_ventana, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50');

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
    //listado los empleados
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
            //mostramos el primer empleado en detalle
            /* mostrar_curso_detalle(JSON.parse(data)[1]);
             id_curso_en_detalle = JSON.parse(data)[1];*/
            for (var i = 1; JSON.parse(data)[i] != null; i = i + 3) {
                //comprueba que no exista el elemento actual
                if ($("li[id_empleado=" + JSON.parse(data)[i] + "]").text() == '') {
                    $(".list-group").append('<li id_empleado="' + JSON.parse(data)[i] + '" class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold nombre_empleado" id_empleado="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 1] + '</div>Area: <span class="area" id_empleado="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 2] + '</span></div> <span class="badge rounded-pill ver-empleado" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-eye"></i></span></li');
                }
            }
            /*$(".ver-curso").click(function(){
               $("#form-agregar-curso").hide();
               $("#agregar-curso").css('background-color','#6e7275a8');
               $(".selector_opc").show();
               
               mostrar_curso_detalle($(this).attr('id_curso'));
            });*/
        })
    }
    //crea un curso nuevo
    function crear_curso() {
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "crear_curso",
                nombre: $("input[name='nombre_curso']").val(),
                ponente: $("input[name='ponente']").val(),
            siguiente: $('.siguiente_switch').prop('checked'),
                descripcion: $("textarea[name='descripcion']").val()
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
    }
    //agrega un nuevo empleado
    function agregar_empleado() {
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "agregar_empleado",
                nombre: $("input[name='nombre_empleado']").val(),
                correo: $("input[name='correo']").val(),
                fecha_nacimiento: $("input[name='fecha_nacimiento']").val(),
                area_departamento: $("input[name='area_departamento']").val(),
                telefono: $("input[name='telefono']").val(),
                domicilio: $("input[name='domicilio']").val(),
                id_RFID: $("#VincularRFID").attr("RFID")
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
    }

    function filtrar_listado() {
        var busqueda = $('input.barra-busqueda').val();
        if (estado_lista == 'cursos') {
            $('.list-group li').each(function (index) {
                if ($(this).first().text().replace('Ponente:', '').indexOf(busqueda) >= 0) {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: flex !important");
                } else {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: none !important");
                }
            });
        }
        if (estado_lista == 'empleados') {
            $('.list-group li').each(function (index) {
                if ($(this).first().text().replace('Area:', '').indexOf(busqueda) >= 0) {
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
                $("#label-actividad-act").html(data);
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
        /* $(".selector_opc").hide();
         $("#agregar-curso").css('background-color', '#ffffff00');
         $("button.guardar_cambios_empleado").hide();
         $("button.agregar_empleado").show();
         $("#form-agregar-empleado").show();
         window.scrollTo(0, 1000);*/




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
            $("#agregar-curso").css('background-color', '#6e7275a8');
            $(".selector_opc").show();
            $("#esperaTag").hide();
            $("#msjRfid").show();
            setTimeout(function () {
                $("#agregar-curso").removeClass('animate__bounceInRight');
            }, 500);

        }, 400);









    });
    $(".confirm_borrar_curso").click(function () {
        $(".modal-borrar-curso").css('display', 'block');
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
    $(".cerrar_modal").click(function () {
        $(".modal").css('display', 'none');
    });
    $(".crear_curso").click(function () {

            if ($("input[name='nombre_curso']").val() != '' && $("input[name='ponente']").val() != ''  && $("textarea[name='descripcion']").val() != '') 
            crear_curso();
            else {
                $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
                $(".modal-exito").show();
            }
    });
    $(".agregar_empleado").click(function () {
        if ($("input[name='nombre_empleado']").val() != '' && $("input[name='correo']").val() != '' && $("input[name='fecha_nacimiento']").val() != '' && $("input[name='area_departamento']").val() != '' && $("input[name='telefono']").val() != '' && $("input[name='domicilio']").val() != '') agregar_empleado();
        else {
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
            $(".modal-exito").show();
        }
    });
   


    $('.editar_curso').click(function () {
        //solo si el formulario ya esta mostrandose
        if ($('#form-agregar-curso').css('display') != 'none') {
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
        //reseteamos elementos
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
        if ($("#titulo-detalle").attr('siguiente') == '1') 
            $('input.siguiente_switch').prop('checked', true);
        else 
            $('input.siguiente_switch').prop('checked', false);
        
        //ocultamos botones del formulario segun corresponda
        $("button.crear_curso").hide();
        $("button.guardar_cambios").show();
    });


    $('.guardar_cambios').click(function () {
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
                $("#agregar-curso").css('background-color', '#6e7275a8');
                $(".selector_opc").show();
            }
        })
    });
    $(".btn_lista_empleados").click(function () {
        $('input.barra-busqueda').attr('placeholder', 'Buscar empleado ó area');
        listado_empleados();
    });
    $(".btn_lista_cursos").click(function () {
        $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente')
        listado_cursos();
    });
    $("input.barra-busqueda").keyup(function () {
        filtrar_listado();
    });

    $("#VincularRFID").on("click", function () {

        $.ajax({
            method: "POST",
            data: { axn: "traer_estado" },
            url: "controladores.php",
            dataType: 'json'
        }).done(function (validar) {

            if (validar.boton == 0) {
                $("#msjRfid").hide();
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

    var tiempoReal = "";
    $(".mostrarTiempoReal").on("click", function () {
        $("#label-actividad-act").show();
        $(".ocultarTiempoReal").show();
        $(".mostrarTiempoReal").hide();
        //Inciamos la actualizacion, cada segundo
        tiempoReal = setInterval(function () { tiempo_real(); }, 500);

    });

    $(".ocultarTiempoReal").on("click", function () {
        $("#label-actividad-act").hide();
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
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "asistencias",
                id_curso: id_curso_a_mostrar
            }
        }).done(function (data) {
            //estoy comprando cuando el curso falla por que no tiene registros
            
            id_curso_en_datatable = id_curso_a_mostrar;
            let i = 0;
            while (i < JSON.parse(data).length) {
                if(JSON.parse(data)!='ERROR')
                {
                    
                    $("table#example tbody").append('<tr><td>' + JSON.parse(data)[i + 1] + '</td><td>' + JSON.parse(data)[i + 2] + '</td><td><span class="tag is-success" title="Fecha y hora de entrada de esta asistencia">'+JSON.parse(data)[i + 3]+'</span></td><td><span class="tag is-danger" title="Fecha y hora de salida de esta asistencia">'+JSON.parse(data)[i + 4]+'</span></td><td><button  class="button is-rounded is-primary btn_download_constancia"><i class="fas fa-download"></i></button></td></tr>');
                }
                i = i + 5;

                //si ya se termino de rellenar el datatable
                if (i == JSON.parse(data).length) {
                    $('table').show();
                    //si no existe un datatable actualmente
                    if ($('#example_wrapper').length == 0) {
                        //descargar asistencias
                        $(".btn_download_constancia").on('click',function(){

                            var nombre = $(this).parent().prev().prev().prev().prev().text();
                            var nom_curso = $('div.nombre_curso[id_curso='+id_curso_en_datatable+']').text();
                            var entrada = $(this).parent().prev().prev().text();
                            var salida = $(this).parent().prev().text();
                            var area  = $(this).parent().prev().prev().prev().text();
                            window.open("constancia.php?nombre="+nombre+"&entrada="+entrada+"&nom_curso="+nom_curso+"&salida="+salida+"&area="+area, 'Constancia de '+nombre, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50');

                            /*$.ajax({
                                type: "POST",
                                url: "constancia.php",
                                data: {
                                    
                                },
                                dataType: "text",
                                success: function (response) {
                                   console.log("Se esta descargando el pdf"); 
                                },
                                error: function (jqXHR, textStatus, errorThrown){
                                    console.log(textStatus);

                                }
                            });*/

                            /*console.log('IMPRESION DE DATOS PARA LA CONTANCIA:')
                            console.log('Nombre: '+$(this).parent().prev().prev().prev().text());
                            console.log('Area: '+$(this).parent().prev().prev().prev().prev().text());
                            console.log('Entrada: '+$(this).parent().prev().prev().text());
                            console.log('Salida: '+$(this).parent().prev().text());
                            console.log($('div.nombre_curso[id_curso='+id_curso_en_datatable+']').text());*/
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

                    } else {
                        //mostrar datatable con animacion
                        bounce_inright_datatable();
                    }
                    $('.lista_cursos li').removeClass('cursor');
                }
            }
        });
    }


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

    //Descomentar para probar en Raspberry
    //NO BORRAR
    //Offline.options = {checks: {xhr: {url: 'https://kren2021com.000webhostapp.com/'}}};
    //NO BORRAR

    var run = function(){
      Offline.check();
    }
    setInterval(run, 2000); //Para saber si seguimos en linea tenemos que checar cada 3 segundos
}); //fin document-ready