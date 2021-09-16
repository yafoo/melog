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
    var $tips_dom = $('<div style="display:none;position:fixed;z-index:' + tips.index + ';left:50%;top:50%;width:200px;margin-left:-100px;padding:10px;border-radius:3px;line-height:1.6;font-size:14px;text-align:center;color:#fff;background-color:rgba(0,0,0,0.5);">' + msg + '</div>');
    $tips_dom.appendTo("body").fadeIn();
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

    // 评论
    var $form = $(".comment-form");
    if($form.length) {
        // 发表评论
        $(".submit").click(function(){
            var data = $form.serializeObject();
            if(data.uname === '') {
                return tips('请填写昵称！');
            }
            if(data.email === '') {
                return tips('请填写邮箱！');
            }
            if(data.content === '') {
                return tips('请填写评论内容！');
            }

            $.post($form.attr("action"), data, function(re){
                if(re.state) {
                    tips(re.msg, 2000, function(){
                        history.go(0);
                    });
                } else {
                    tips(re.msg);
                }
            });
        });

        // 取消回复
        $(".cancel").click(function(){
            $("input[name=pid]").val(0);
            $(this).hide();
            $(".comment .title").after($(".comment-form"));
        });

        // 加载更多评论
        $(".comment-more").click(function(){
            if($(this).data('more') == 'none') {
                return tips('没有更多了！');
            }
            if($(this).data('more') == 'loading') {
                return tips('评论正在加载中！');
            }
            getComment();
        });

        // 获取评论
        function getComment() {
            getComment.page || (getComment.page = 0);
            getComment.page++;
            $(".comment-more").text('评论加载中..').data('more', 'loading');
            $.get($(".comment-list").data("url") + '&page=' + getComment.page, function(re){
                $(".comment-more").text('加载更多评论').data('more', '');
                if(!re.state) {
                    return tips(re.msg);
                }
                var list = re.data;
                if(list.length == 0) {
                    $(".comment-more").text('没有更多评论了！').data('more', 'none');
                }
                list = $('<div>' + parseComment(list) + '</div>');
                list.find(".face").click(function(){
                    $("input[name=pid]").val($(this).data('id'));
                    $(".cancel").show();
                    $(this).parent().after($(".comment-form"));
                    tips('回复 ' + $(this).data('uname') + ' 的评论', 1000);
                });
                list.children().appendTo(".comment-list");
            }).error(function () {
                getComment.page--;
                $(".comment-more").text('加载更多评论').data('more', '');
                tips('请求出错了！');
            });
        }

        // 解析评论模板
        function parseComment(list) {
            parseComment.HTML || (parseComment.HTML = $(".comment-list").html(), $(".comment-list").html(''));
            var html = '';
            list.forEach(item => {
                html += parseComment.HTML.replace(/\[(.*?)\]/g, function(match, pos){
                    switch(pos){
                        case "face": return jdenticon.toSvg(item.uname, 80);
                        case "add_time": return format('YYYY-mm-dd HH:ii', item.add_time);
                        case "reply": return item.child ? parseComment(item.child) : '';
                        default : return htmlEscape(item[pos].toString());
                    }
                });
            });
            return html;
        }

        getComment();
    }

    
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

    // 代码高亮
    hljs.initHighlightingOnLoad();
});