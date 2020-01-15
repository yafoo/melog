const {Model} = require('iijs');

class User extends Model {
    async getList(condition, rows=10, order='id', sort='asc'){
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }

    async getUser(condition){
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

    // 加密密码
    passmd5(password, salt){
        const utils = this.$$utils;
        return utils.md5(salt + utils.md5(salt + utils.md5(password + salt) + salt));
    }
}

module.exports = User;