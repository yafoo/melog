const {Model} = require('iijs');

class Article extends Model {
    async getList(condition, rows=10, order='id', sort='desc'){
        return await this.db.field('id,cate_id,user_id,title,writer,source,source_link,click,keywords,description,add_time,update_time').where(condition).order(order, sort).limit(rows).select();
    }

    async getOne(condition){
        return await this.db.where(condition).find();
    }

    async getOneByID(id){
        return await this.getOne({id});
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

    //获取文章及分类属性
    async getListWithCate(condition, rows=10, page, pageSize){
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,c.cate_name,c.folder').join('cate c', 'a.cate_id=c.id').where(condition).order('a.id', 'desc').limit(rows).page(page, pageSize).cache(600).select();
    }

    //获取列表分页数据
    async getPageList(condition){
        const page = this.$pagination.cate.page()._page;
        const pageSize = this.$pagination.cate._pageSize;
        const [total, list] = await Promise.all([
            this.db.where(condition).cache(600).count('id'),
            this.db.field('id,cate_id,user_id,title,writer,source,click,keywords,description,add_time').where(condition).order('id', 'desc').page(page, pageSize).cache(600).select()
        ]);
        return [total, list];
    }

    //最新文章
    async getNew(rows=8){
        return await this.db.field('id,title,click').order('id', 'desc').limit(rows).cache(600).select();
    }

    //热点文章
    async getHot(rows=8){
        return await this.db.field('id,title,click').order('click', 'desc').limit(rows).cache(600).select();
    }

    //上一篇
    async prevOne(cur_id, condition) {
        return await this.db.field('id,title').where({id: ['>', cur_id]}).where(condition).order('id', 'asc').cache(600).find();
    }

    //下一篇
    async nextOne(cur_id, condition) {
        return await this.db.field('id,title').where({id: ['<', cur_id]}).where(condition).order('id', 'desc').cache(600).find();
    }
}

module.exports = Article;