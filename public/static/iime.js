$(function(){
    $(".navbar-menu").click(function(){
        if($(".navbar-item").height() == 0) {
            $(".navbar-item").height($(".navbar-item").children().length * 41);
        } else {
            $(".navbar-item").height(0);
        }
    });

    $(window).scroll(function(e){
        if($(this).scrollTop() > 200){
            $('#go-top').fadeIn(400);
        }else{
            $('#go-top').stop().fadeOut(400);
        }
    });
    
    $('#go-top').click(function(){
        $('html,body').animate({scrollTop:'0px'}, 200);
    });
});