$( document ).ready(function() {
       
    $(".avs").hide();

    $(".entrar").on('click', function(){
         

        if($("input[name='email']").val()=='' || $("input[name='password']").val()=='')
        {
            $(".animate__animated").addClass("animate__swing");
            setTimeout(function(){  $(".animate__animated").removeClass("animate__swing"); }, 600);
            return false;
        }
 
         
             $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "login",
                correo: $("input[name='email']").val(),
                password: $("input[name='password']").val()
            }
            }).done(function(data) {
                if(JSON.parse(data)!=true)
                {
                    $(".avs").hide();
                    $('.pass_inv').show();
                }else{
                    window.location="../index.php";
                }
            })
        
    });

    $("input[name='email']").on('focusout', function(){
         if($("input[name='email']").val()=='')
         {
            $(".avs").hide();
            return false;
         }
        $.ajax({
            method: "POST",
            url: "controladores.php",
            data: {
                axn: "comprobar_correo",
                correo: $("input[name='email']").val()
            }
        }).done(function(data) {

           
           if(JSON.parse(data)==true)
           {
            $(".avs").hide();
            $('.fa-check').css('color','#3DD6AF');
            $('.fa-check').show();
            $('.correo_avs').css('color','black');
            $('.correo_avs').text('Correo valido');
            $('.correo_avs').show();
           }else{
            $(".avs").hide();
            $('.fa-times').show();
            $('.correo_avs').css('color','red');
            $('.correo_avs').text('Correo invalido');
            $('.correo_avs').show();
           }

        })
    });

    $("input[name='email']").on('input', function(){
       
            $(".avs").hide();
    });

    $("input[name='password']").on('input', function(){
        
            $(".pass_inv").hide();
    });

});
