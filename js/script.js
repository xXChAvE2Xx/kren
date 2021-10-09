$(document).ready(function() {
    $("#label-actividad-act").hide();
    $(".ocultarTiempoReal").hide();
    $("#esperaTag").hide();
    
    $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente');
    var estado_lista = '';
    //llamamos a la funcion para listar los cursos
    listado_cursos();
    //ocultamos formularios el de cursos se oculta solo en listado_curso()
    $("#form-agregar-empleado").hide();
    var id_curso_en_detalle = 0;
    //muestra los detalles de un curso
    function mostrar_curso_detalle(id_curso) {
        if (id_curso_en_detalle == id_curso) return false;
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "mostrar_curso_detalle",
                id_curso: id_curso
            }
        }).done(function(data) {
            $("#titulo-detalle").text($(".nombre_curso[id_curso=" + id_curso + "]").text());
            $("#ponente").html('<i class="fas fa-user-tie"></i> ' + $(".ponente[id_curso=" + id_curso + "]").text());
            $("#info").text(JSON.parse(data)[6]);
            if (JSON.parse(data)[5] != 1) {
                $(".inscritos-detalle").text('Registrados: ' + JSON.parse(data)[3] + '/' + JSON.parse(data)[4]);
                $(".inscritos-detalle").attr('registrados', JSON.parse(data)[3]);
                $(".inscritos-detalle").attr('permitidos', JSON.parse(data)[4]);
            } else {
                $(".inscritos-detalle").text('Registrados: ' + JSON.parse(data)[3] + '/ilimitados');
                $(".inscritos-detalle").attr('registrados', JSON.parse(data)[3]);
                $(".inscritos-detalle").attr('permitidos', 'false');
            }
            $(".fecha_aplicacion").text('Aplicación: ' + JSON.parse(data)[1]);
            $(".fecha_aplicacion").attr('fecha', JSON.parse(data)[1]);
            $(".hora_aplicacion").text('Hora: ' + JSON.parse(data)[2]);
            $(".hora_aplicacion").attr('hora', JSON.parse(data)[2]);
            id_curso_en_detalle = id_curso;
        })
    }
    //lista los cursos diponibles
    function listado_cursos() {
        if (estado_lista != 'cursos') {
            $('.list-group').empty();
            estado_lista = 'cursos';
        } else return false;
        console.log('aca:');
        //carga listado de cursos
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "listado_cursos"
            }
        }).done(function(data) {
            //mostramos el primer curso en detalle
            mostrar_curso_detalle(JSON.parse(data)[1]);
            id_curso_en_detalle = JSON.parse(data)[1];
            for (var i = 1; JSON.parse(data)[i] != null; i = i + 3) {
                //comprueba que no exista el elemento actual
                if ($("li[id_curso=" + JSON.parse(data)[i] + "]").text() == '') {
                    $(".list-group").append('<li id_curso="' + JSON.parse(data)[i] + '" class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold nombre_curso" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 1] + '</div>Ponente: <span class="ponente" id_curso="' + JSON.parse(data)[i] + '">' + JSON.parse(data)[i + 2] + '</span></div> <span class="badge rounded-pill ver-curso" id_curso="' + JSON.parse(data)[i] + '"><i class="fas fa-eye"></i></span></li');
                    $(".iniciar_curso").attr("id_curso", id_curso_en_detalle);
                }
            }
            $(".ver-curso").click(function() {
                $("#form-agregar-curso").hide();
                $("#agregar-curso").css('background-color', '#6e7275a8');
                $(".selector_opc").show();
                $(".iniciar_curso").attr("id_curso",$(this).attr('id_curso'));
                mostrar_curso_detalle($(this).attr('id_curso'));
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
            url: "/kren/controladores.php",
            data: {
                axn: "listado_empleados"
            }
        }).done(function(data) {
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
        if ($('.usu_permitidos_switch').prop('checked') == true) {
            var $cant_usuarios = 0;
            var $ilimitados = 1;
        } else {
            var $cant_usuarios = $("input[name='cant_usuarios']").val();
            var $ilimitados = 0;
        }
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "crear_curso",
                nombre: $("input[name='nombre_curso']").val(),
                ponente: $("input[name='ponente']").val(),
                fecha: $("input[name='fecha']").val(),
                hora: $("input[name='hora']").val(),
                cant_usuarios: $cant_usuarios,
                usuarios_ilimitados: $ilimitados,
                descripcion: $("textarea[name='descripcion']").val()
            }
        }).done(function(data) {
            if (JSON.parse(data) == true) {
                estado_lista = '';
                listado_cursos();
                $("#form-agregar-curso input").val('');
                $("#form-agregar-curso textarea").val('');
                $("#form-agregar-curso input[type='checkbox']").removeAttr('checked');
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
            url: "/kren/controladores.php",
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
        }).done(function(data) {
            var data = data.trim();
            console.log(data);
            if (data == "true") {
                if(data != 0){
                    $("#form-agregar-empleado input").val('');
                    console.log(data);
                    $("#VincularRFID").removeAttr("RFID")
                    $("#VincularRFID").removeClass("btn-success");
                    $("#VincularRFID").addClass("btn-warning");
                    $(".modal-exito .title").html("<i class='fas fa-check-circle'></i> Empleado agregado con exito");
                    $(".modal-exito").show();
                }else{
                    $(".modal-exito .title").html("<i class='fas fa-times'></i> Error: RFID utilizado por otro usuario");
                    $(".modal-exito").show();
                    $("#VincularRFID").removeClass("btn-success");
                    $("#VincularRFID").addClass("btn-warning");
                    $("#VincularRFID").removeAttr("rfid");
                }
            } else {
                $(".modal-exito .title").html("<i class='fas fa-times'></i> Error al agregar el empleado");
                $(".modal-exito").show();       
            }
            estado_lista = '';
            listado_empleados();
        })
    }

    function filtrar_listado() {
        var busqueda = $('input.barra-busqueda').val();
        if (estado_lista == 'cursos') {
            $('.list-group li').each(function(index) {
                if ($(this).first().text().replace('Ponente:', '').indexOf(busqueda) >= 0) {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: flex !important");
                } else {
                    $('li[id_curso=' + $(this).attr('id_curso') + ']').attr("style", "display: none !important");
                }
            });
        }
        if (estado_lista == 'empleados') {
            $('.list-group li').each(function(index) {
                if ($(this).first().text().replace('Area:', '').indexOf(busqueda) >= 0) {
                    $('li[id_empleado=' + $(this).attr('id_empleado') + ']').attr("style", "display: flex !important");
                } else {
                    $('li[id_empleado=' + $(this).attr('id_empleado') + ']').attr("style", "display: none !important");
                }
            });
        }
    }

    //Muestra el registro tiempo real
    function tiempo_real(){
        $.ajax({
            method: "POST",
            url:"/kren/controladores.php",
            data: {axn:'actualizar_Entradas'},
            dataType: 'text'
        }).done(function(data){
            //console.log(data);
            $("#label-actividad-act").html(data);
        })
    }
    
    

    $("#form-agregar-curso").hide();
    $("#plus-agregar").click(function() {
        $(".selector_opc").hide();
        $("#agregar-curso").css('background-color', '#ffffff00');
        $("button.guardar_cambios").hide();
        $("button.crear_curso").show();
        $("#form-agregar-curso").show();
        window.scrollTo(0, 1000);
    });
    $("#plus-agregar-empleado").click(function() {
        $(".selector_opc").hide();
        $("#agregar-curso").css('background-color', '#ffffff00');
        $("button.guardar_cambios_empleado").hide();
        $("button.agregar_empleado").show();
        $("#form-agregar-empleado").show();
        window.scrollTo(0, 1000);
    });
    $(".cerrar-formulario").click(function() {
        $("#form-agregar-empleado input").val('');
        $("#VincularRFID").removeAttr("RFID")
        $("#VincularRFID").removeClass("btn-success");
        $("#VincularRFID").removeClass("btn-danger");
        $("#VincularRFID").addClass("btn-warning");
        $(".span-formularios").hide();
        $("#agregar-curso").css('background-color', '#6e7275a8');
        $(".selector_opc").show();
        $("#esperaTag").hide();
        $("#msjRfid").show();
    });
    $(".confirm_borrar_curso").click(function() {
        $(".modal-borrar-curso").css('display', 'block');
    });
    $(".borrar_curso").click(function() {
        $(".modal").css('display', 'none');
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "borrar_curso",
                id_curso: id_curso_en_detalle
            }
        }).done(function(data) {
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
    $(".cerrar_modal").click(function() {
        $(".modal").css('display', 'none');
    });
    $(".crear_curso").click(function() {
        if ($('.usu_permitidos_switch').prop('checked') == true) {
            if ($("input[name='nombre_curso']").val() != '' && $("input[name='fecha']").val() != '' && $("input[name='ponente']").val() != '' && $("input[name='hora']").val() != '' && $("textarea[name='descripcion']").val() != '') crear_curso();
            else {
                $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
                $(".modal-exito").show();
            }
        } else {
            if ($("input[name='nombre_curso']").val() != '' && $("input[name='cant_usuarios']").val() != '' && $("input[name='fecha']").val() != '' && $("input[name='ponente']").val() != '' && $("input[name='hora']").val() != '' && $("textarea[name='descripcion']").val() != '') crear_curso();
            else {
                $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
                $(".modal-exito").show();
            }
        }
    });
    $(".agregar_empleado").click(function() {
        if ($("input[name='nombre_empleado']").val() != '' && $("input[name='correo']").val() != '' && $("input[name='fecha_nacimiento']").val() != '' && $("input[name='area_departamento']").val() != '' && $("input[name='telefono']").val() != '' && $("input[name='domicilio']").val() != '') agregar_empleado();
        else {
            $(".modal-exito .title").html("<i class='fas fa-times'></i> Datos incompletos");
            $(".modal-exito").show();
        }
    });
    $('.usu_permitidos_switch').click(function() {
        if ($('.usu_permitidos_switch').prop('checked') == true) $('input.u_permitidos').prop('disabled', true);
        else $('input.u_permitidos').prop('disabled', false);
    });
    $('.editar_curso').click(function() {
        window.scrollTo(0, 1000);
        $(".selector_opc").hide();
        $("#agregar-curso").css('background-color', '#ffffff00');
        $("#form-agregar-curso").show();
        $("input[name='nombre_curso']").val($('span#titulo-detalle').text());
        $("input[name='ponente']").val($('span#ponente').text());
        $("input[name='fecha']").val($('span.fecha_aplicacion').attr('fecha'));
        $("input[name='hora']").val($('span.hora_aplicacion').attr('hora'));
        $('textarea.des_form').text($('#info').text());
        if ($(".inscritos-detalle").attr('permitidos') == 'false') {
            $('input.usu_permitidos_switch').prop('checked', true);
            $("input[name='cant_usuarios']").val('');
            $("input[name='cant_usuarios']").prop('disabled', true);
        } else {
            $('input.usu_permitidos_switch').prop('checked', false);
            $("input[name='cant_usuarios']").prop('disabled', false)
            $("input[name='cant_usuarios']").val($(".inscritos-detalle").attr('permitidos'));
        }
        $("button.crear_curso").hide();
        $("button.guardar_cambios").show();
    });
    $('.guardar_cambios').click(function() {
        if ($('input.usu_permitidos_switch').prop('checked') == true) var usuarios_permitidos = 'true';
        else var usuarios_permitidos = $("input[name='cant_usuarios']").val();
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "actualizar_curso",
                id_curso: id_curso_en_detalle,
                nombre_curso: $("input[name='nombre_curso']").val(),
                ponente: $("input[name='ponente']").val(),
                fecha: $("input[name='fecha']").val(),
                hora: $("input[name='hora']").val(),
                descripcion: $('.des_form').val(),
                usuarios_permitidos: usuarios_permitidos
            }
        }).done(function(data) {
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
    $(".btn_lista_empleados").click(function() {
        $('input.barra-busqueda').attr('placeholder', 'Buscar empleado ó area');
        listado_empleados();
    });
    $(".btn_lista_cursos").click(function() {
        $('input.barra-busqueda').attr('placeholder', 'Buscar curso ó ponente')
        listado_cursos();
    });
    $("input.barra-busqueda").keyup(function() {
        filtrar_listado();
    });
    $("#VincularRFID").on("click", function() {
        console.log("click");
        $.ajax({
            method: "POST",
            data: {axn: "traer_estado"},
            url: "/kren/controladores.php",
            dataType: 'json'
        }).done(function(validar) {
            console.log(validar.boton);
            if(validar.boton == 0){
                $("#msjRfid").hide();
                $("#esperaTag").show();
                $.ajax({
                    method: "POST",
                    url: "/kren/controladores.php",
                    data: {
                        axn: "traer_id_rfid",
                    },
                    dataType : 'text'
                }).done(function(data) {
                    var id = data.trim();
                    $("#VincularRFID").attr("RFID",id)
                    $("#VincularRFID").removeClass("btn-danger");
                    $("#VincularRFID").removeClass("btn-warning");
                    $("#VincularRFID").addClass("btn-success");
                    $.notify("Se agrego el ID: "+id, "success");
                    $("#esperaTag").hide();
                    $("#msjRfid").show();
                })
           }else{
                $("#VincularRFID").removeClass("btn-warning");
                $("#VincularRFID").addClass("btn-danger");
                $.notify("RFID ya en uso", "warn");
            }
        })
      
    });

    var tiempoReal = "";
    $(".mostrarTiempoReal").on("click", function(){
        $("#label-actividad-act").show();
        $(".ocultarTiempoReal").show();
        $(".mostrarTiempoReal").hide();
        //Inciamos la actualizacion, cada segundo
        tiempoReal = setInterval(tiempo_real, 500);
    });

    $(".ocultarTiempoReal").on("click", function(){
        $("#label-actividad-act").hide();
        $(".ocultarTiempoReal").hide();
        $(".mostrarTiempoReal").show();
        //Inciamos la actualizacion, cada segundo
        clearInterval(tiempoReal);
        $.ajax({
            method: "POST",
            url: "/kren/controladores.php",
            data: {
                axn: "borrar_Act_Act",
            }
        }).done(function(data) {

        })

    });


    $(".cerrar_sesion").on("click", function(){
        $.post( 'csesion.php', function( data ) {if(data!='')location.reload();});
    });

    /*$(".iniciar_curso").on("click", function(){
        var id_curso = $(this).attr("id_curso");
        console.log(id_curso);

    });*/


}); //fin document-ready