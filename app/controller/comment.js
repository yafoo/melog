const {Controller} = require('jj.js');

class Comment extends Controller
{
    async _init() {
        this.site = await this.$model.site.getConfig();
    }

    async list() {
        const id = parseInt(this.ctx.query.id) || 0;
        const page = parseInt(this.ctx.query.page) || 1;
        const article = await this.$model.article.getArticle({id}, 'id,is_comment');
        if(!article) {
            return this.$error('文章不存在或已删除！');
        }
        if(article.is_comment + this.site.is_comment < 1) {
            if(this.site.is_comment == 0) {
                return this.$error('系统已关闭评论功能！');
            } else {
                return this.$error('本文已关闭评论功能！');
            }
        }

        const list = await this.$model.comment.getPageList(id, page);
        this.$success(this.$utils.toTreeArray(list).reverse());
    }

    async post() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        if(!data.uname) {
            return this.$error('昵称不能为空！');
        }
        if(!data.content) {
            return this.$error('评论内容不能为空！');
        }

        data.article_id = parseInt(data.article_id);
        const article = await this.$model.article.getArticle({id: data.article_id}, 'id,is_comment');
        if(!article) {
            return this.$error('文章不存在或已删除！');
        }
        if(article.is_comment + this.site.is_comment < 1) {
            if(this.site.is_comment == 0) {
                return this.$error('系统已关闭评论功能！');
            } else {
                return this.$error('本文已关闭评论功能！');
            }
        }
        
        data.pid = parseInt(data.pid);
        if(data.pid) {
            const reply = await this.$model.comment.get({id: data.pid});
            if(!reply) {
                return this.$error('原评论不存在或已删除！');
            }
            data.comment_id = reply.comment_id;
        }
        data.user_id = this.$service.cookie.get('user') || 0;
        data.ip = this.$utils.getIP(this.ctx.req);

        const err = await this.$model.comment.addComment(data);
        if(err) {
            this.$error(err);
        } else {
            this.$success(data.pid ? '回复成功！' : '评论成功！');
        }
    }
}

module.exports = Comment;