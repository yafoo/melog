$(function(){
    $(".navbar-menu").click(function(){
        if($(".navbar-item").height() == 0) {
            $(".navbar-item").height($(".navbar-item").children().length * 41);
        } else {
            $(".navbar-item").height(0);
        }
    });

    var showGoTop = $('#footer').offset().top - $(window).height() + +$('#footer').css('margin-top').replace(/[^0-9]/g, '');
    $(window).scroll(function(e){
        if($(this).scrollTop() > 200){
            $('#go-top').fadeIn(400);
            $(this).scrollTop() > showGoTop ? $('#go-top').addClass('go-top') : $('#go-top').removeClass('go-top');
        }else{
            $('#go-top').stop().fadeOut(400);
        }
    });
    
    $('#go-top').click(function(){
        $('html,body').animate({scrollTop:'0px'}, 200);
    });

    hljs.initHighlightingOnLoad();
});