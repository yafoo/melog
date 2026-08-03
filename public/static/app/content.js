$(function() {
    // 评论
    var reg_email = /.+@.+/i;
    var reg_url = /^http(s)?:\/\//i;

    var $form = $(".comment-form");
    if($form.length) {
        // 发表评论
        $(".submit").click(function(){
            var data = $form.serializeObject();
            if(data.uname === '') {
                return tips('请填写昵称！');
            }
            if(data.email && !reg_email.test(data.email)) {
                return tips('请填写正确的邮箱！');
            }
            if(data.url && !reg_url.test(data.url)) {
                return tips('网址前缀需写http://或https://！');
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
                        case "url": return !item.url ? '' : (!reg_url.test(item.url) ? 'http://' : '') + htmlEscape(item.url);
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

    // 代码高亮
    hljs.highlightAll();

    // 文章图片点击查看
    $('article.content img').each(function() {
        var that = $(this);
        if(that.attr('alt')) {
            that.attr('title', that.attr('alt'));
        }

        that.click(function() {
            window.open(that.attr('src'));
        });
    });
});