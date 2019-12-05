const {Model} = require('iijs');

class Article extends Model {
    async getList(condition, rows=10){
        return await this.db.where(condition).order('id', 'desc').limit(rows).select();
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

    async latest(rows=8){
        return await this.db.limit(rows).select();
    }

    async hot(rows=8){
        return await this.db.order('click', 'desc').limit(rows).select();
    }
}

module.exports = Article;