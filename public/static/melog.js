jQuery.prototype.serializeObject = function() {  
    var obj=new Object();  
    $.each(this.serializeArray(),function(index,param){  
        if(!(param.name in obj)){  
            obj[param.name]=param.value;  
        }  
    });  
    return obj;  
};

function tips(msg, time, callback) {
    msg === undefined && (msg = '');
    time === undefined && (time = 3000);
    tips.index === undefined && (tips.index = 1000);
    tips.index++;
    var $tips_dom = $('<div style="display:none;position:fixed;z-index:' + tips.index + ';left:50%;top:50%;width:200px;margin-left:-100px;padding:10px;border-radius:3px;line-height:1.6;font-size:14px;text-align:center;color:#fff;background-color:rgba(0,0,0,0.5);"></div>');
    $tips_dom.appendTo("body").text(msg).fadeIn();
    setTimeout(function(){
        $tips_dom.fadeOut(function(){
            $tips_dom.remove();
            typeof callback == 'function' && callback();
        });
    }, time);
}

function htmlEscape(text) {
    return text.replace(/[<>&"\n]/g, function(match){
        switch(match){
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "\"": return "&quot;";
            case "\n": return "<br>";
        }
    });
}

function format(fmt, date) {
    (typeof date === 'string' || typeof date === 'number') && (date = new Date(parseInt(date + '000')));
	  date = date || new Date();
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "y+": date.getFullYear().toString().slice(2),// 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "h+": (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()).toString(),// 时
        "i+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

$(function() {
    // 顶部导航
    $(".navbar-menu").click(function() {
        if($(".navbar-item").height() == 0) {
            $(".navbar-item").height($(".navbar-item").children().length * 41);
        } else {
            $(".navbar-item").height(0);
        }
    });

    // 侧边搜索
    $(".s-button").click(function() {
        if(!$(".s-input").val()) {
            tips('请输入关键词！');
        } else {
            $(".s-form").submit();
        }
    });
    
    // 返回顶部
    var showGoTop = $('#footer').offset().top - $(window).height() + +$('#footer').css('margin-top').replace(/[^0-9]/g, '');
    $(window).scroll(function(e) {
        if($(this).scrollTop() > 200){
            $('#go-top').fadeIn(400);
            $(this).scrollTop() > showGoTop ? $('#go-top').addClass('go-top') : $('#go-top').removeClass('go-top');
        }else{
            $('#go-top').stop().fadeOut(400);
        }
    });
    $('#go-top').click(function() {
        $('html,body').animate({scrollTop:'0px'}, 200);
    });
});