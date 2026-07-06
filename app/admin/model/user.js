const {Model} = require('jj.js');

class User extends Model
{
    async getUserList(condition, rows=10, order='id', sort='asc') {
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }

    async saveUser(data) {
        if(data.id) {
            data.add_time = this.$utils.time();
        } else {
            data.update_time = this.$utils.time();
        }

        if(data.password) {
            data.salt = this.$utils.randomString(8);
            data.password = this.passmd5(data.password, data.salt);
        } else {
            delete data.password;
        }

        return await this.save(data);
    }

    async lock(id) {
        return await this.db.where({id}).inc('is_lock');
    }

    async login(email, password) {
        const user = await this.get({email});

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
    }

    async logout() {
        this.$service.cookie.delete('user');
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