const {Model} = require('iijs');
const {randomString} = require('../../config/utils');

class User extends Model {
    async getList(condition, rows=10, order='id', sort='asc'){
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }

    async getOne(condition){
        return await this.db.where(condition).find();
    }

    async add(data){
        const user_data = {...data};

        user_data.salt = randomString(8);
        user_data.password = this.passmd5(user_data.password, user_data.salt);

        return await this.db.insert(user_data);
    }

    async update(data, condition){
        const user_data = {...data};

        if(user_data.password) {
            user_data.salt = randomString(8);
            user_data.password = this.passmd5(user_data.password, user_data.salt);
        } else {
            delete user_data.password;
        }
        
        return await this.db.update(user_data, condition);
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