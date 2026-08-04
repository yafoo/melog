const {Controller} = require('jj.js');
const TokenModel = require('../../admin/model/token');

// 控制器+方法 -> 所需权限 映射表
// 新增控制器时在此扩展即可
const PERM_MAP = {
    cate: {
        list:   TokenModel.PERM_CATE_READ,
        detail: TokenModel.PERM_CATE_READ,
        create: TokenModel.PERM_CATE_CREATE,
        edit:   TokenModel.PERM_CATE_EDIT,
        delete: TokenModel.PERM_CATE_DELETE,
    },
    article: {
        list:   TokenModel.PERM_ARTICLE_READ,
        detail: TokenModel.PERM_ARTICLE_READ,
        create: TokenModel.PERM_ARTICLE_CREATE,
        edit:   TokenModel.PERM_ARTICLE_EDIT,
        delete: TokenModel.PERM_ARTICLE_DELETE,
    }
};

class Base extends Controller
{
    // 当前验证通过的token记录，子类可通过 this.tokenInfo 访问
    tokenInfo = null;

    async _init() {
        // 获取token（query参数 或 Authorization header）
        let tokenStr = this.$request.get('token', '');
        if(!tokenStr) {
            const authHeader = this.$request.header('authorization') || '';
            if(authHeader.startsWith('Bearer ')) {
                tokenStr = authHeader.substring(7);
            }
        }

        if(!tokenStr) {
            return this.$error('缺少token参数');
        }

        // 验证token有效性
        const tokenModel = this.$admin.model.token;
        this.tokenInfo = await tokenModel.getTokenByValue(tokenStr);
        if(!this.tokenInfo) {
            return this.$error('Token无效或已过期');
        }

        // 根据控制器+方法查权限映射，无映射则不检查权限
        const ctrl = this.ctx.CONTROLLER;
        const action = this.ctx.ACTION;
        const requiredPerm = PERM_MAP[ctrl]?.[action] || 0;

        if(requiredPerm && !tokenModel.hasPermission(this.tokenInfo, requiredPerm)) {
            return this.$error('权限不足');
        }
    }
}

module.exports = Base;
