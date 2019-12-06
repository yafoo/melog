const {Model} = require('iijs');

class Article extends Model {
    async getList(condition, rows=10, order='id', sort='desc'){
        return await this.db.field('id,cate_id,user_id,title,writer,source,source_link,click,keywords,description,add_time,update_time').where(condition).order(order, sort).limit(rows).cache(60).select();
    }

    async getListByCate(cate_id, rows=10, order='id', sort='desc'){
        return await this.getList({cate_id}, rows, order, sort);
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
        return await this.db.table('article a').field('a.id,a.cate_id,a.user_id,a.title,a.writer,a.click,a.description,a.add_time,c.cate_name,c.cate_folder').join('cate c', 'a.cate_id=c.id').where(condition).limit(rows).page(page, pageSize).cache(600).select();
    }

    //最新文章
    async getNew(rows=8){
        return await this.db.field('id,title,click').limit(rows).cache(600).select();
    }

    //热点文章
    async getHot(rows=8){
        return await this.db.field('id,title,click').order('click', 'desc').limit(rows).cache(600).select();
    }
}

module.exports = Article;