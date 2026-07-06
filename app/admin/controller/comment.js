const Base = require('./base');

class Comment extends Base
{
    async index() {
        const condition = {};
        const keyword = this.ctx.query.keyword;
        if(keyword) {
            condition['concat(comment.uname, comment.email, comment.url, comment.content, comment.ip)'] = ['like', '%' + keyword + '%'];
        }
        const [list, pagination] = await this.$model.comment.getCommentList(condition);
        
        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());

        await this.$fetch();
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        
        const err = await this.$model.comment.delComment(id);
        if(err) {
            this.$error(err);
        } else {
            this.$success('删除成功！', 'index');
        }
    }
}

module.exports = Comment;