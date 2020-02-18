const {Model} = require('iijs');

class Article extends Model {
    async getList(condition, rows=10, order='id', sort='desc'){
        return await this.db.field('id,cate_id,user_id,title,writer,source,source_url,click,keywords,description,add_time,update_time').where(condition).order(order, sort).limit(rows).select();
    }

    async getOne(condition){
        return await this.db.where(condition).find();
    }

    async add(data){
        return await this.db.insert(data);
    }

    async update(data, condition){
        return await this.db.update(data, condition);
    }

    async delete(condition){
        return await this.db.delete(condition);
    }

    // 后台文章列表
    async getArticleList(condition){
        const page = this.$$pagination.curPage;
        const pageSize = this.$$pagination.options.pageSize;
        const [total, list] = await Promise.all([
            this.db.table('article a').where(condition).cache(60).count('id'),
            this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').page(page, pageSize).select()
        ]);
        return [total, list];
    }

    // 更新评论总数
    async updateComment(article_id, comment_total) {
        return await this.db.update({comment_total}, {id: article_id});
    }
}

module.exports = Article;