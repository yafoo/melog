const {Model} = require('jj.js');

class Comment extends Model
{
    // 后台评论管理
    async getCommentList(condition) {
        const page = this.$pagination.curPage;
        const pageSize = this.$pagination.options.pageSize;
        const [total, list] = await Promise.all([
            this.db.table('comment comment').where(condition).cache(60).count('id'),
            this.db.table('comment comment').field('comment.*,a.title').join('article a', 'comment.article_id=a.id').where(condition).order('comment.id', 'desc').page(page, pageSize).select()
        ]);
        const pagination = total ? this.$pagination.render(total) : '';
        return [list, pagination];
    }

    // 文章评论列表
    async getPageList(article_id, page=1) {
        const comment_ids = await this.db.where({article_id, pid: 0}).order('id', 'desc').page(page, 10).column('id');
        if(!comment_ids.length) {
            return [];
        }
        return await this.db.field('id,pid,article_id,user_id,uname,url,content,add_time').where({comment_id: ['in', comment_ids]}).order('id', 'asc').limit(100).select();
    }

    async getOne(condition) {
        return await this.db.where(condition).find();
    }

    // 新增评论
    async add(data) {
        if(!data.add_time) {
            data.add_time = this.$utils.time();
        }
        try {
            await this.db.startTrans(async () => {
                const result = await this.db.insert(data);
                data.comment_id || await this.db.update({comment_id: result.insertId}, {id: result.insertId});
                const comment_total = await this.db.where({article_id: data.article_id}).count();
                // 框架不完美，此处需写 this.$admin.model
                // this.$model 写法，在前台调用时会定位到前台model
                this.$admin.model.article.updateComment(data.article_id, comment_total);
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    async delete(condition) {
        return await this.db.delete(condition);
    }

    // 删除评论
    async delComment(id) {
        const comment = await this.getOne({id});
        if(!comment) {
            return '数据不存在！';
        }

        try {
            await this.db.startTrans(async () => {
                if(comment.pid == 0) {
                    await this.db.delete({comment_id: id});
                    return true;
                }

                const ids = [id];
                const children = await this.getChildren(id);
                children.forEach(item => {
                    ids.push(item.id);
                });
                await this.db.delete({id: ['in', ids]});

                const comment_total = await this.db.where({article_id: comment.article_id}).count();
                this.$model.article.updateComment(comment.article_id, comment_total);
            });
            return true;
        } catch (e) {
            return '删除失败！';
        }
    }

    // 获取评论回复
    async getChildren(pid) {
        let data = [];
        if(pid == 0) {
            return data;
        }
        const list = await this.db.select({pid});
        data = data.concat(list);
        for(const item of list) {
            data = data.concat(await this.getChildren(item.id));
        }
        return data;
    }
}

module.exports = Comment;