const {Controller} = require('jj.js');

class Base extends Controller
{
    // 当前验证通过的token记录
    tokenInfo = null;

    async _init() {
        // 设置JSON响应
        this.$assign('title', 'API');
    }

    // 验证token并检查权限
    async auth(requiredPerm = 0) {
        // 从header或query参数获取token
        let tokenStr = this.$request.get('token', '');
        if(!tokenStr) {
            const authHeader = this.$request.header('authorization');
            if(authHeader.startsWith('Bearer ')) {
                tokenStr = authHeader.substring(7);
            }
        }

        if(!tokenStr) {
            return this.$error('缺少token参数');
        }

        // 查询token
        const tokenModel = this.$model.token;
        this.tokenInfo = await tokenModel.getTokenByValue(tokenStr);
        if(!this.tokenInfo) {
            return this.$error('Token无效或已过期');
        }

        // 检查权限
        if(requiredPerm && !tokenModel.hasPermission(this.tokenInfo, requiredPerm)) {
            return this.$error('权限不足');
        }

        return true;
    }
}

module.exports = Base;
