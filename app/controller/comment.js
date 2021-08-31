const {Controller} = require('jj.js');

class Comment extends Controller
{
    async _init() {
        this.site = await this.$admin.model.site.getConfig();
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

        const list = await this.$admin.model.comment.getPageList(id, page);
        this.$success(this.$utils.toTreeArray(list).reverse());
    }

    async post() {
        if(this.ctx.method != 'POST'){
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        if(!data.uname) {
            return this.$error('昵称不能为空！');
        }
        if(!data.email) {
            return this.$error('邮箱不能为空！');
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
            const reply = await this.$admin.model.comment.getOne({id: data.pid});
            if(!reply) {
                return this.$error('原评论不存在或已删除！');
            }
            data.comment_id = reply.comment_id;
        }
        data.user_id = this.$service.cookie.get('user') || 0;
        data.ip = this.$utils.getIP(this.ctx.req);

        const result = await this.$admin.model.comment.add(data);
        if(result) {
            this.$success('评论成功！');
        } else {
            this.$error('评论失败！');
        }
    }
}

module.exports = Comment;