const Base = require('./base');

class Comment extends Base {
    async index() {
        const condition = {};
        const keys = this.ctx.query.keys;
        if(keys !== undefined) {
            condition['concat(comment.uname, comment.email, comment.url, comment.content, comment.ip)'] = ['like', '%' + keys + '%'];
        }
        const [total, list] = await this.$model.comment.getCommentList(condition);
        const pagination = total ? this.$$pagination.render(total) : '';
        this.assign('keys', keys);
        this.assign('list', list);
        this.assign('pagination', pagination);
        await this.fetch();
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        const result = await this.$model.comment.delete(id);

        if(result === true) {
            this.success('删除成功！', 'index');
        } else {
            this.error(result);
        }
    }
}

module.exports = Comment;