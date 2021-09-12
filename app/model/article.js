const {Model} = require('jj.js');

class Article extends Model
{
    // 首页文章列表
    async getIndexList(condition, rows=10){
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').limit(rows).cache(600).select();
    }

    // 栏目文章列表及分页
    async getPageList(condition) {
        return await this.db.field('id,cate_id,user_id,title,writer,source,click,keywords,description,add_time').where(condition).order('id', 'desc').cache(600).pagination(this.$pagination.cate);
    }

    // 搜索文章列表及分页
    async getSearchList(condition, pageSize=10) {
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.keywords,a.click,a.description,a.add_time,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').cache(600).pagination(undefined, pageSize);
    }

    // 获取一篇文章
    async getArticle(condition, fields) {
        return await this.db.field(fields).where(condition).find();
    }

    // 最新文章
    async getNew(rows=8) {
        return await this.db.field('id,title,click').order('id', 'desc').limit(rows).cache(600).select();
    }

    // 热点文章
    async getHot(rows=8) {
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