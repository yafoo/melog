const Base = require('./base');

/**
 * @typedef {import("jj.js/types").PaginateResult} PaginateResult
 */

class Article extends Base
{
    /**
     * 首页文章列表
     * @param condition
     * @returns {Promise<PaginateResult>}
     */
    async getIndexList(page_size=10, with_page=false) {
        const modle = this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.keywords,a.click,a.description,a.add_time,a.thumb,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').order('a.id', 'desc').limit(page_size).withCache(this.cacheTime);
        if(with_page) {
            return await modle.paginate({page_size, pagination: this.$pagination.index});
        } else {
            return [await modle.select()];
        }
    }

    /**
     * 栏目文章列表及分页
     * @param condition
     * @returns {Promise<PaginateResult>}
     */
    async getPageList(condition, page_size=10) {
        return await this.db.field('id,cate_id,user_id,title,writer,source,click,keywords,description,add_time,thumb').where(condition).order('id', 'desc').withCache(this.cacheTime).paginate({page_size, pagination: this.$pagination.cate});
    }

    /**
     * 搜索文章列表及分页
     * @param condition
     * @returns {Promise<PaginateResult>}
     */
    async getSearchList(condition, page_size=10) {
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.keywords,a.click,a.description,a.add_time,a.thumb,c.cate_name,c.cate_dir').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').withCache(this.cacheTime).paginate({page_size});
    }

    // 获取一篇文章
    async getArticle(condition, fields) {
        return await this.db.field(fields).where(condition).find();
    }

    // 最新文章
    async getNew(rows=8) {
        return await this.db.field('id,title,click,thumb').order('id', 'desc').limit(rows).withCache(this.cacheTime).select();
    }

    // 热点文章
    async getHot(rows=8) {
        return await this.db.field('id,title,click,thumb').order('click', 'desc').limit(rows).withCache(this.cacheTime).select();
    }

    // 上一篇
    async prevOne(id, condition) {
        return await this.db.field('id,title,thumb').where({id: ['>', id]}).where(condition).order('id', 'asc').withCache(this.cacheTime).find();
    }

    // 下一篇
    async nextOne(id, condition) {
        return await this.db.field('id,title,thumb').where({id: ['<', id]}).where(condition).order('id', 'desc').withCache(this.cacheTime).find();
    }

    // 相关文章
    async getRelated(condition, rows=10) {
        let keywords = condition.keywords;
        delete condition.keywords;
        typeof keywords != 'array' && (keywords = keywords.split(',').filter(val => val !== ''));
        if(keywords.length == 0) {
            return [];
        }
        const field = 'id,title,click,thumb,CONCAT(`title`, `keywords`) keywords';
        /** @type {Object} */
        const where = {};
        keywords.forEach(keyword => {
            where[keyword] = ['exp', 'keywords like ?', 'or', `%${keyword}%`];
        });
        return await this.db.field(field).where(condition).where(where).order('id', 'desc').limit(rows).withCache(this.cacheTime).select();
    }
}

module.exports = Article;