const {Model} = require('jj.js');

class User extends Model
{
    async getList(condition, rows=10, order='id', sort='asc') {
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }

    async getOne(condition) {
        return await this.db.where(condition).find();
    }

    async add(data) {
        const user_data = {...data};

        user_data.salt = this.$utils.randomString(8);
        user_data.password = this.passmd5(user_data.password, user_data.salt);
        user_data.add_time = this.$utils.time();

        return await this.db.insert(user_data);
    }

    async update(data, condition) {
        const user_data = {...data};

        if(user_data.password) {
            user_data.salt = this.$utils.randomString(8);
            user_data.password = this.passmd5(user_data.password, user_data.salt);
        } else {
            delete user_data.password;
        }
        user_data.update_time = this.$utils.time();
        
        return await this.db.update(user_data, condition);
    }

    async delete(condition) {
        return await this.db.delete(condition);
    }

    async lock(id) {
        return await this.db.where({id}).inc('is_lock');
    }

    async login(email, password) {
        const user = await this.getOne({email});

        if(!user) {
            return '账号或密码错误！';
        }

        if(this.is_lock(user)) {
            return '账号已被锁定，请联系管理员！';
        }

        if(user.password != this.passmd5(password, user.salt)) {
            await this.lock(user.id);
            return user.is_lock < -2 ? '账号或密码错误！' : '密码剩余次数：' + (1 - user.is_lock);
        }

        await this.db.update({is_lock: -5, login_time: this.$utils.time()}, {id: user.id});
        this.$service.cookie.set('user', user.id);
        return true;
    }

    async logout() {
        this.$service.cookie.delete('user');
        return true;
    }

    is_lock(user) {
        return user.is_lock > 0;
    }

    // 加密密码
    passmd5(password, salt) {
        const md5 = this.$utils.md5;
        return md5(salt + md5(salt + md5(password + salt) + salt));
    }
}

module.exports = User;