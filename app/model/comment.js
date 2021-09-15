const {Model} = require('jj.js');

class Comment extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    // 评论列表
    async getPageList(article_id, page = 1) {
        const comment_ids = await this.db.where({article_id, pid: 0}).order('id', 'desc').page(page, 10).cache(this.cacheTime).column('id');
        if(!comment_ids.length) {
            return [];
        }
        return await this.db.field('id,pid,article_id,user_id,uname,url,content,add_time').where({comment_id: ['in', comment_ids]}).order('id', 'asc').limit(100).cache(this.cacheTime).select();
    }

    // 新增评论
    async addComment(data) {
        if(!data.add_time) {
            data.add_time = this.$utils.time();
        }
        try {
            await this.db.startTrans(async () => {
                const result = await this.add(data);
                data.comment_id || await this.save({comment_id: result.insertId}, {id: result.insertId});
                await this.$admin.model.article.updateCommentTotal(data.article_id);
            });

            // 清理数据库缓存
            this.db.deleteCache();
        } catch (e) {
            this.$logger.error('新增评论出错：' + e.message);
            return '新增评论出错';
        }
    }
}

module.exports = Comment;