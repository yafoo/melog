const Base = require('./base');

class Comment extends Base
{
    async index() {
        const condition = {};
        const keyword = this.$request.get('keyword');
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
        const id = this.$request.get('id', 0);
        
        const err = await this.$model.comment.delComment(id);
        if(err) {
            this.$error(err);
        } else {
            this.$success('删除成功！', 'index');
        }
    }
}

module.exports = Comment;