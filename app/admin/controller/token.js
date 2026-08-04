const Base = require('./base');
const TokenModel = require('../model/token');
const {PERM_GROUPS} = TokenModel;

class Token extends Base
{
    async index() {
        const list = await this.$model.token.getTokenList();

        // 为每个token附加权限描述和用户信息
        for(const item of list) {
            item.perm_desc = this.$model.token.getPermDesc(item.permissions);
            const user = await this.$model.user.get({id: item.user_id});
            item.username = user ? user.username : '未知';
            item.expire_time = item.expire_time ? this.$utils.date('YYYY-mm-dd HH:ii:ss', item.expire_time) : '永不过期';
            item.add_time = item.add_time ? this.$utils.date('YYYY-mm-dd HH:ii:ss', item.add_time) : '未知';
        }

        this.$assign('list', list);
        this.$assign('title', 'Token管理');
        await this.$fetch();
    }

    async form() {
        const id = this.$request.get('id', 0);
        let token = {};
        if(id) {
            token = await this.$model.token.get({id});
            if(token) {
                token.perm_arr = this.$model.token.permToArray(token.permissions);
            }
        }

        // 获取用户列表
        const users = await this.$model.user.getUserList(undefined, 100);

        this.$assign('token', token);
        this.$assign('users', users);
        this.$assign('perm_groups', PERM_GROUPS);
        this.$assign('title', id ? 'Token编辑' : 'Token新增');
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.$request.postAll();
        const isUpdate = data.id > 0;

        if(!data.name) {
            return this.$error('Token名称不能为空！');
        }
        if(!data.user_id) {
            return this.$error('请选择所属账号！');
        }

        // 处理过期时间
        if(data.expire_date) {
            data.expire_time = this.$utils.time(data.expire_date);
        } else {
            data.expire_time = 0; // 永不过期
        }
        delete data.expire_date;

        // 处理权限（checkbox提交，可能是数组或单个值）
        if(!Array.isArray(data.permissions_arr)) {
            data.permissions_arr = data.permissions_arr ? [data.permissions_arr] : [];
        }

        if(!isUpdate) {
            data.add_time = this.$utils.time();
        }
        data.update_time = this.$utils.time();

        const result = await this.$model.token.saveToken(data);
        if(result) {
            this.$success(isUpdate ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(isUpdate ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = this.$request.get('id', 0);

        const result = await this.$model.token.del({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }

    // 重新生成token
    async regenerate() {
        const id = this.$request.get('id', 0);
        if(!id) {
            return this.$error('参数错误！');
        }

        const newToken = this.$model.token.generateToken();
        const result = await this.$model.token.save({id, token: newToken, update_time: this.$utils.time()});
        if(result) {
            this.$success('Token已重新生成！', 'form?id=' + id);
        } else {
            this.$error('生成失败！');
        }
    }
}

module.exports = Token;
