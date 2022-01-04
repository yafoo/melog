const {Model} = require('jj.js');

class Article extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    // 首页文章列表
    async getIndexList(condition, rows=10){
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.keywords,a.click,a.description,a.add_time,a.thumb,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').limit(rows).cache(this.cacheTime).select();
    }

    // 栏目文章列表及分页
    async getPageList(condition, page_size=10) {
        return await this.db.field('id,cate_id,user_id,title,writer,source,click,keywords,description,add_time,thumb').where(condition).order('id', 'desc').cache(this.cacheTime).pagination(this.$pagination.cate, page_size);
    }

    // 搜索文章列表及分页
    async getSearchList(condition, pageSize=10) {
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.keywords,a.click,a.description,a.add_time,a.thumb,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').cache(this.cacheTime).pagination(undefined, pageSize);
    }

    // 获取一篇文章
    async getArticle(condition, fields) {
        return await this.db.field(fields).where(condition).find();
    }

    // 最新文章
    async getNew(rows=8) {
        return await this.db.field('id,title,click,thumb').order('id', 'desc').limit(rows).cache(this.cacheTime).select();
    }

    // 热点文章
    async getHot(rows=8) {
        return await this.db.field('id,title,click,thumb').order('click', 'desc').limit(rows).cache(this.cacheTime).select();
    }

    // 上一篇
    async prevOne(id, condition) {
        return await this.db.field('id,title,thumb').where({id: ['>', id]}).where(condition).order('id', 'asc').cache(this.cacheTime).find();
    }

    // 下一篇
    async nextOne(id, condition) {
        return await this.db.field('id,title,thumb').where({id: ['<', id]}).where(condition).order('id', 'desc').cache(this.cacheTime).find();
    }

    // 相关文章
    async getRelated(condition, rows=10) {
        let keywords = condition.keywords;
        if(!keywords) {
            return [];
        }
        typeof keywords != 'array' && (keywords = keywords.split(','));
        keywords = keywords.filter(val => val != '').join('|').replace(/"/, '');
        if(keywords == '') {
            return [];
        }
        condition.keywords = ['exp', 'CONCAT_WS(`title`, `keywords`) REGEXP ' + `"${keywords}"`];
        return await this.db.field('id,title,click,thumb').where(condition).order('id', 'desc').limit(rows).cache(this.cacheTime).select();
    }
}

module.exports = Article;