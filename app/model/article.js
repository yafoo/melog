const {Model} = require('iijs');

class Article extends Model {
    async getList(condition, rows=10){
        return await this.db.where(condition).order('id', 'desc').limit(rows).select();
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
}

module.exports = Article;