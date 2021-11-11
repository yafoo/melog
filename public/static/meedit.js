;(function($, window, document, layer) {
    var markdown = window.markdownit();

    var Meedit = function(ele, opt) {
        this.area = ele;
        this.$area = $(ele);
        this.init(opt);
    }

    var M = Meedit.prototype;

    M.init = function(opt) {
        // 包裹html
        this.wrap_html();

        // 默认参数
        this.defaults = {
            upload_index: '',
            upload_upload: '',
            upload_callback: 'upload_callback',
            onupload: null,
            onrender: null,
            hide_tools: [],
            cancel_steps: 10
        },
        this.options = $.extend({}, this.defaults, opt);

        // 内部变量
        this._areaChanged = false;
        this._timer = null;
        this._data = [this.area.value];
        this._dataIndex = 0;

        // this
        var that = this;

        // 编辑框
        this.area.caret = this.caret;
        this.$area.on('keyup', function() {
            that.keyup();
        });
        this.$area.on('paste', function(e) {
            that.paste(e);
        });

        // 工具栏
        this.$m.find('.meedit-tool .layui-icon').each(function() {
            var $this = $(this);
            var command = $this.attr('command');
            if(~that.options.hide_tools.indexOf(command)) {
                $this.hide();
            } else {
                $this.click(function(e) {
                    that['tool_' + command]($(this), e);
                });
            }
        });

        // 工具栏 - 插入表格
        this.$m.find('.meedit-table-select-item').on('mouseover', function(e) {
            var row = parseInt($(this).attr('row')) + 1;
            var col = parseInt($(this).attr('col')) + 1;
            
            that.$m.find('.meedit-table-select-row').each(function(i) {
                $(this).children().each(function(j) {
                    if(i < row && j < col) {
                        $(this).addClass('hover');
                    } else {
                        $(this).removeClass('hover');
                    }
                });
            });
    
            that.$m.find('.meedit-table-select-tips').text(row + '行' + col + '列');
        });
        this.$m.find('.meedit-table-select').on('mouseout', function(e) {
            var event = window.event || e;
            var obj = event.toElement || event.relatedTarget;
            if(!this.contains(obj)) {
                $(this).find('.meedit-table-select-item').removeClass('hover');
            }
        });

        // 预览关闭
        this.$m.find('.meview-title').click(function(e) {
            if(e.offsetX > 15 && e.offsetX <= 15 + 30 && e.offsetY > 6 && e.offsetY <= 6 + 30) {
                that.$m.find('.meedit-tool-view').click();
            }
        });

        // 左右滚动同步
        this.$area.hover(function() {
            that.syncScroll(that.$area, that.$m.find(".meview-content"));
        });
        this.$m.find(".meview-content").hover(function() {
            that.syncScroll($(this), that.$area);
        });

        // PC端自动打开预览
        if($(window).width() > 450) {
            this.$m.find('.meedit-tool-view').click();
        }

        // layer选择图片回调
        window[this.options.upload_callback] = function(image) {
            layer.closeAll();
            typeof(image) == 'string' && (image = {image: image});
            that.tool_wrap_image(image.image, image.title);
            that.options.onupload && that.options.onupload(image);
        }
    }

    // 初始化html
    M.wrap_html = function() {
        this.$m = $(
            '<div class="meedit-wrap">' +
                '<div class="meedit">' +
                    '<div class="meedit-tool">' +
                        '<i class="layui-icon" title="标题" command="title" style="font-size: 17px; font-weight: bold;">H</i>' +
                        '<i class="layui-icon" title="加粗" command="bold">&#xe62b;</i>' +
                        '<i class="layui-icon" title="斜体" command="italic">&#xe644;</i>' +
                        '<i class="layui-icon" title="删除线" command="delete">&#xe64f;</i>' +
                        '<span class="meedit-tool-mid"></span>' +
                        '<i class="layui-icon" title="引用" command="quote" style="font-size: 18px;">&#xe687;</i>' +
                        '<i class="layui-icon" title="列表" command="list">&#xe66b;</i>' +
                        '<i class="layui-icon" title="代码" command="code" style="font-size: 20px;">&#xe64e;</i>' +
                        '<span class="meedit-tool-mid"></span>' +
                        '<i class="layui-icon" title="插入链接" command="link">&#xe64c;</i>' +
                        '<i class="layui-icon" title="图片" command="image">&#xe64a;</i>' +
                        '<i class="layui-icon meedit-tool-table" title="表格" command="table" style="font-size: 22px; border-bottom: 2px solid #fff; margin-bottom: 1px;">&#xe62d;</i>' +
                        '<span class="meedit-tool-mid"></span>' +
                        '<i class="layui-icon" title="撤销" command="cancel" style="font-weight: bold; transform: rotateY(180deg);">&#xe666;</i>' +
                        '<i class="layui-icon" title="恢复" command="recover" style="font-weight: bold;">&#xe666;</i>' +
                        '<i class="layui-icon" title="帮助" command="help" style="font-weight: bold;">&#xe664;</i>' +
                        '<span class="meedit-tool-mid"></span>' +
                        '<i class="layui-icon meedit-tool-view" title="预览" command="view" layedit-event="v">&#xe691;</i>' +
                    '</div>' +
                '</div>' +
                '<div class="meview" style="display: none;">' +
                    '<div class="meview-title">内容预览</div>' +
                    '<div class="meview-content"></div>' +
                '</div>' +
            '</div>'
        );
        this.$m.insertBefore(this.$area);
        this.$area.addClass('meedit-area').appendTo(this.$m.find('.meedit'));

        this.$m.find('.meedit-tool-table').append(
            '<div class="meedit-table-select">'
                + '<div class="meedit-table-select-list">'
                + (function(){
                    var arr = [];
                    for(var i = 0; i < 10; i++) {
                        arr.push('<div class="meedit-table-select-row">');
                        for(var j = 0; j < 8; j++) {
                            arr.push('<div class="meedit-table-select-item" row="' + i + '" col="' + j + '"></div>');
                        }
                        arr.push('</div>');
                    }
                    return arr.join("\n");
                })()
                + '</div>'
                + '<div class="meedit-table-select-tips">'
                + '</div>'
            + '</div>'
        );
    }

    // 内容编辑
    M.keyup = function() {
        this.save();
    }

    // 保存变动
    M.save = function() {
        if(this._data[this._dataIndex] == this.area.value) {
            return;
        }

        if(this._data.length > this._dataIndex + 1) {
            this._data.length = this._dataIndex + 1;
        }

        this._data.push(this.area.value);
        if(this._dataIndex == this.options.cancel_steps) {
            this._data.shift();
        } else {
            this._dataIndex++;
        }
        this.render();
    }

    // 粘贴图片
    M.paste = function(event) {
        if (event.clipboardData || event.originalEvent) {
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if (clipboardData.items) {
                var items = clipboardData.items,
                    len = items.length,
                    blob = null;
                for (var i = 0; i < len; i++) {
                    if (~items[i].type.indexOf("image")) {
                        blob = items[i].getAsFile();
                    }
                }
                if (blob !== null) {
                    var that = this;
                    this.upload_image(blob, function(image) {
                        typeof(image) == 'string' && (image = {image: image});
                        that.tool_wrap_image(image.image, image.title);
                        that.options.onupload && that.options.onupload(image);
                    });
                    event.preventDefault();
                }
            }
        }
    }

    // 图片上传
    M.upload_image = function(blob, callback) {
        var data = new FormData();
        data.append('file', blob);
        layer.load();
        $.ajax({
            url: this.options.upload_upload,
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function(res) {
                if(res.state) {
                    callback(res.data);
                } else {
                    layer.msg(res.msg);
                }
            },
            error: function() {
                layer.msg('上传出错了！');
            },
            complete: function() {
                layer.closeAll();
            }
        });
    }

    M.tool_title = function() {
        this.tool_begin('#');
    }

    M.tool_bold = function() {
        this.tool_wrap('**');
    }

    M.tool_italic = function() {
        this.tool_wrap('*');
    }

    M.tool_delete = function() {
        this.tool_wrap('~~');
    }

    M.tool_quote = function() {
        this.tool_begin('>');
    }

    M.tool_list = function() {
        this.tool_begin('- ');
    }

    M.tool_code = function() {
        this.tool_wrap('`');
    }

    M.tool_link = function() {
        this.tool_wrap_str('[', ']()');
    }

    M.tool_image = function() {
        layer.open({
            type: 2,
            title: '插入图片',
            shadeClose: true,
            shade: 0.2,
            area: ['360px', '455px'],
            content: this.options.upload_index
        });
    }

    M.tool_table = function($target, e) {
        var $item = $(e.target);
        if(!$item.hasClass('meedit-table-select-item')) {
            return;
        }
        var row = parseInt($item.attr('row')) + 1;
        var col = parseInt($item.attr('col')) + 1;
        var str = "\n";
        for(var i = -2; i < row; i++) {
            str += '|';
            for(var j = 0; j < col; j++) {
                str += i == -1 ? '--|' : '  |';
            }
            str += "\n";
        }
        this.tool_wrap_str(str);
        $target.addClass('no-hover');
        setTimeout(function() {
            $target.removeClass('no-hover');
        }, 100);
    }

    M.tool_cancel = function() {
        if(this._dataIndex == 0) {
            return;
        }

        this._dataIndex--;
        this.area.value = this._data[this._dataIndex];
        this.render();
    }

    M.tool_recover = function() {
        if(this._dataIndex == this._data.length - 1) {
            return;
        }

        this._dataIndex++;
        this.area.value = this._data[this._dataIndex];
        this.render();
    }

    M.tool_help = function() {
        layer.open({
            title: '关于',
            content: 'Meedit V1.0<br>支持网页及本地图片粘贴上传'
        });
    }

    M.tool_view = function($target) {
        var $meview = this.$m.find('.meview');
        var $meedit = this.$m.find('.meedit');
        var is_mobile = $(window).width() <= 450;
        if($target.hasClass('hover')) {
            $target.removeClass('hover');
            $meview.hide();
            $meedit.show();
        } else {
            $target.addClass('hover');
            $meview.show();
            is_mobile && $meedit.hide();

            this.render();
        }
    }

    // 光标位置
    M.caret = function(begin, end) {
        if (this.length == 0) return;

        if (typeof begin == 'number') {
            end = (typeof end == 'number') ? end : begin;
            if (this.setSelectionRange) { //现代浏览器
                this.setSelectionRange(begin, end);
                this.focus();
            } else if (this.createTextRange) { //IE678
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', begin);
                range.select();
            }
        } else {
            if (this.setSelectionRange) { //现代浏览器
                begin = this.selectionStart;
                end = this.selectionEnd;
            } else if (document.selection && document.selection.createRange) { //IE678
                var range = document.selection.createRange();
                begin = 0 - range.duplicate().moveStart('character', -this.value.length);
                end = begin + range.text.length;
            }
            return {
                begin: begin,
                end: end
            };
        }
    }

    // markdown
    M.render = function() {
        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = setTimeout(this.render, 200);
            return;
        }

        if(!this.$m.find('.meedit-tool-view').hasClass('hover')) {
            return;
        }

        this.$m.find('.meview-content').html(markdown.render(this.area.value));
        hljs && this.$m.find('.meview-content pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        this.options.onrender && this.options.onrender();
    }

    // 滚动同步
    M.syncScroll = function($master, $slave) {
        $slave.off('scroll');
        $master.off('scroll').on('scroll', function() {
            var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
            var height = percentage * ($slave.get(0).scrollHeight - $slave.get(0).offsetHeight);
            $slave.scrollTop(height);
        });
    }

    // 行首加字符
    M.tool_begin = function(str) {
        var len = str.length;
        var pos = this.area.caret().begin;
        var text = this.area.value;
        if(pos == 0) {
            pos = text.length;
        }
        for(var i = pos; i >= 0; i--) {
            if(text[i - 1] == "\n" || i == 0) {
                var str1 = text.substr(0, i);
                var str2 = text.substr(i);
                if(str2.substr(0, len) == str) {
                    this.area.value = str1 + str + str2;
                    this.area.caret(pos + len);
                } else {
                    this.area.value = str1 + str + ' ' + str2;
                    this.area.caret(pos + len + 1);
                }
                break;
            }
        }
        this.render();
        this.save();
    }

    // 两边加字符
    M.tool_wrap = function(str) {
        var len = str.length;
        var pos = this.area.caret();
        var text = this.area.value;
        var str1 = text.substr(0, pos.begin) || '';
        var str2 = text.substr(pos.begin, pos.end - pos.begin) || '';
        var str3 = text.substr(pos.end) || '';
        if(str1.length > len - 1 && str3.length > len - 1 && str1.substr(-len) == str && str3.substr(0, len) == str && str != '`') {
            this.area.value = [str1.substr(0, str1.length - len), str2, str3.substr(len)].join('');
            this.area.caret(pos.begin - len, pos.end - len);
        } else {
            this.area.value = [str1, str2, str3].join(str);
            this.area.caret(pos.begin + len, pos.end + len);
        }
        this.render();
        this.save();
    }

    // 两边加字符串
    M.tool_wrap_str = function(left, right, replace) {
        right || (right = '');
        var len = left.length;
        var pos = this.area.caret();
        var text = this.area.value;
        var str1 = text.substr(0, pos.begin) || '';
        var str2 = replace || text.substr(pos.begin, pos.end - pos.begin) || '';
        var str3 = text.substr(pos.end) || '';
        this.area.value = str1 + left + str2 + right + str3;
        if(str2.length) {
            this.area.caret(pos.begin + len + str2.length + (replace ? 0 : 2));
        } else {
            this.area.caret(pos.begin + len, pos.end + len);
        }
        this.render();
        this.save();
    }

    // 加图片字符串
    M.tool_wrap_image = function(image, title) {
        this.tool_wrap_str('![', '](' + image + ')', title);
    }

    // jquery插件
    $.fn.meedit = function(options) {
        return this.each(function() {
            !window.meedit && (window.meedit = []);
            window.meedit.push(new Meedit(this, options));
        });
    }

})(jQuery, window, document, layer);