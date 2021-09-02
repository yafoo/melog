const Base = require('./base');

class Comment extends Base
{
    async index() {
        const condition = {};
        const keyword = this.ctx.query.keyword;
        if(keyword !== undefined) {
            condition['concat(comment.uname, comment.email, comment.url, comment.content, comment.ip)'] = ['like', '%' + keyword + '%'];
        }
        const [list, pagination] = await this.$model.comment.getCommentList(condition);
        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination);
        await this.$fetch();
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        
        const result = await this.$model.comment.delComment(id);
        if(result === true) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error(result);
        }
    }
}

module.exports = Comment;