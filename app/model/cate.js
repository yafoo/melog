const {Model} = require('iijs');

class Cate extends Model {
    async getList(condition, rows=10, order='id', sort='desc'){
        return await this.db.where(condition).order(order, sort).limit(rows).select();
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

    async getNav(rows){
        return await this.db.limit(rows).order('cate_sort', 'asc').cache(600).select();
    }
}

module.exports = Cate;