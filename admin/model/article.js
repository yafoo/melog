const {Model} = require('jj.js');

class Article extends Model
{
    // 后台文章列表
    async getArticleList(condition) {
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,a.thumb,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').pagination();
    }

    // 文章新增修改
    async saveArticle(data, condition) {
        if(!data.id && !data.add_time) {
            data.add_time = this.$utils.time();
        }
        if(data.id && !data.update_time) {
            data.update_time = this.$utils.time();
        }
        return await super.save(data, condition);
    }

    // 更新评论总数
    async updateCommentTotal(id) {
        const comment_total = await this.$model.comment.db.where({article_id: id}).count();
        return await this.save({id, comment_total});
    }
}

module.exports = Article;