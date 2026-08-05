layui.use(['element'], function() {
    var element = layui.element;
    var $ = layui.$;
    
    // 清理缓存
    $('#cache-clear').click(function() {
        $.get($(this).data('url'), function(res) {
            layer.msg(res.msg);
        });
    });
    
    // 折叠按钮
    var isMobile = $(window).width() <= 768;
    $('#meToggle').on('click', function() {
        if (isMobile) {
            // 移动端：滑入/滑出
            $('#meSide').toggleClass('me-mobile-show');
            if ($('#meSide').hasClass('me-mobile-show')) {
                $('#meMask').show();
            } else {
                $('#meMask').hide();
            }
        } else {
            // PC端：折叠/展开
            $('#meSide').toggleClass('me-collapsed');
            $('#meMain').toggleClass('me-expanded');
            var icon = $(this).find('.layui-icon');
            if ($('#meSide').hasClass('me-collapsed')) {
                icon.removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
            } else {
                icon.removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
            }
        }
    });
    
    // 移动端遮罩
    $('#meMask').on('click', function() {
        $('#meSide').removeClass('me-mobile-show');
        $(this).hide();
    });
    if(isMobile) $('#meToggle .layui-icon').removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
});