const {Model} = require('iijs');

class Article extends Model {
    // 获取一篇文章
    async getArticle(condition, fields=''){
        return await this.db.field(fields).where(condition).find();
    }

    // 首页文章列表
    async getIndexList(condition, rows=10, page, pageSize){
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').limit(rows).page(page, pageSize).cache(600).select();
    }

    // 栏目文章列表及分页
    async getPageList(condition){
        const page = this.$pagination.cate.curPage;
        const pageSize = this.$pagination.cate.options.pageSize;
        const [total, list] = await Promise.all([
            this.db.where(condition).cache(600).count('id'),
            this.db.field('id,cate_id,user_id,title,writer,source,click,keywords,description,add_time').where(condition).order('id', 'desc').page(page, pageSize).cache(600).select()
        ]);
        return [total, list];
    }

    // 最新文章
    async getNew(rows=8){
        return await this.db.field('id,title,click').order('id', 'desc').limit(rows).cache(600).select();
    }

    // 热点文章
    async getHot(rows=8){
        return await this.db.field('id,title,click').order('click', 'desc').limit(rows).cache(600).select();
    }

    // 上一篇
    async prevOne(cur_id, condition) {
        return await this.db.field('id,title').where({id: ['>', cur_id]}).where(condition).order('id', 'asc').cache(600).find();
    }

    // 下一篇
    async nextOne(cur_id, condition) {
        return await this.db.field('id,title').where({id: ['<', cur_id]}).where(condition).order('id', 'desc').cache(600).find();
    }
}

module.exports = Article;