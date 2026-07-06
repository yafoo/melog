const {Model} = require('jj.js');

class Comment extends Model
{
    // 后台评论管理
    async getCommentList(condition) {
        return await this.db.table('comment comment').field('comment.*,a.title').join('article a', 'comment.article_id=a.id').where(condition).order('comment.id', 'desc').pagination();
    }

    // 删除评论
    async delComment(id) {
        const comment = await this.get({id});
        if(!comment) {
            return '数据不存在！';
        }

        try {
            await this.db.startTrans(async () => {
                if(comment.pid == 0) {
                    await this.del({comment_id: id});
                    return;
                }

                const ids = [id];
                const children = await this.getChildren(id);
                children.forEach(item => {
                    ids.push(item.id);
                });
                await this.del({id: ['in', ids]});

                await this.$model.article.updateCommentTotal(comment.article_id);
            });

            // 清理数据库缓存
            this.db.deleteCache();
        } catch (e) {
            this.$logger.error('删除失败：' + e.message);
            return '删除失败！';
        }
    }

    // 获取评论回复
    async getChildren(pid) {
        let data = [];
        if(pid == 0) {
            return data;
        }
        const list = await this.all({pid});
        data = data.concat(list);
        for(const item of list) {
            data = data.concat(await this.getChildren(item.id));
        }
        return data;
    }
}

module.exports = Comment;