const {Model} = require('jj.js');

// 权限位定义（位掩码，方便扩展）
// 分类：bit 0-3
const PERM_CATE_READ   = 1 << 0;  // 1
const PERM_CATE_CREATE = 1 << 1;  // 2
const PERM_CATE_EDIT   = 1 << 2;  // 4
const PERM_CATE_DELETE = 1 << 3;  // 8
// 文章：bit 4-7
const PERM_ARTICLE_READ   = 1 << 4;  // 16
const PERM_ARTICLE_CREATE = 1 << 5;  // 32
const PERM_ARTICLE_EDIT   = 1 << 6;  // 64
const PERM_ARTICLE_DELETE = 1 << 7;  // 128

// 权限分组（用于后台表单展示）
const PERM_GROUPS = [
    {
        name: '分类管理',
        items: [
            {bit: PERM_CATE_READ,   key: 'cate_read',   label: '查看'},
            {bit: PERM_CATE_CREATE, key: 'cate_create', label: '新增'},
            {bit: PERM_CATE_EDIT,   key: 'cate_edit',   label: '编辑'},
            {bit: PERM_CATE_DELETE, key: 'cate_delete', label: '删除'},
        ]
    },
    {
        name: '文章管理',
        items: [
            {bit: PERM_ARTICLE_READ,   key: 'article_read',   label: '查看'},
            {bit: PERM_ARTICLE_CREATE, key: 'article_create', label: '新增'},
            {bit: PERM_ARTICLE_EDIT,   key: 'article_edit',   label: '编辑'},
            {bit: PERM_ARTICLE_DELETE, key: 'article_delete', label: '删除'},
        ]
    }
];

// 全部分选权限
const PERM_ALL_CATE = PERM_CATE_READ | PERM_CATE_CREATE | PERM_CATE_EDIT | PERM_CATE_DELETE;
// 全部文章权限
const PERM_ALL_ARTICLE = PERM_ARTICLE_READ | PERM_ARTICLE_CREATE | PERM_ARTICLE_EDIT | PERM_ARTICLE_DELETE;
// 全部权限
const PERM_ALL = PERM_ALL_CATE | PERM_ALL_ARTICLE;

class Token extends Model
{
    // 获取token列表
    async getTokenList(condition, rows=100, order='id', sort='asc') {
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }

    // 保存token（新增或更新）
    async saveToken(data) {
        if(!data.id) {
            data.add_time = this.$utils.time();
            // 新增时生成token
            data.token = this.generateToken();
        } else {
            data.update_time = this.$utils.time();
        }

        // 处理权限位
        data.permissions = this.calcPermissions(data.permissions_arr || []);
        delete data.permissions_arr;

        return await this.save(data);
    }

    // 根据token字符串获取有效token记录
    async getTokenByValue(tokenStr) {
        const token = await this.db.where({token: tokenStr}).find();
        if(!token) return null;

        // 检查是否过期（expire_time为0表示永不过期）
        if(token.expire_time > 0 && token.expire_time < this.$utils.time()) {
            return null;
        }
        return token;
    }

    // 生成随机token字符串
    generateToken() {
        const random = this.$utils.randomString;
        return 'ml_' + random(32) + this.$utils.md5(random(16) + Date.now());
    }

    // 根据权限数组计算权限位掩码
    calcPermissions(permArr) {
        let perms = 0;
        const permMap = {};
        PERM_GROUPS.forEach(group => {
            group.items.forEach(item => {
                permMap[item.key] = item.bit;
            });
        });
        permArr.forEach(key => {
            if(permMap[key]) {
                perms |= permMap[key];
            }
        });
        return perms;
    }

    // 检查token是否拥有指定权限
    hasPermission(token, requiredPerm) {
        return (token.permissions & requiredPerm) === requiredPerm;
    }

    // 将权限位掩码转为数组（用于表单回显）
    permToArray(perms) {
        const arr = [];
        PERM_GROUPS.forEach(group => {
            group.items.forEach(item => {
                if(perms & item.bit) {
                    arr.push(item.key);
                }
            });
        });
        return arr;
    }

    // 获取权限描述文本
    getPermDesc(perms) {
        const descs = [];
        PERM_GROUPS.forEach(group => {
            const groupPerms = [];
            group.items.forEach(item => {
                if(perms & item.bit) {
                    groupPerms.push('<span class="layui-badge layui-bg-green">' + item.label + '</span>');
                }
            });
            if(groupPerms.length) {
                descs.push(group.name + ': ' + groupPerms.join(' '));
            }
        });
        return descs.join('<br>');
    }
}

module.exports = Token;
module.exports.PERM_GROUPS = PERM_GROUPS;
module.exports.PERM_ALL = PERM_ALL;
module.exports.PERM_CATE_READ = PERM_CATE_READ;
module.exports.PERM_CATE_CREATE = PERM_CATE_CREATE;
module.exports.PERM_CATE_EDIT = PERM_CATE_EDIT;
module.exports.PERM_CATE_DELETE = PERM_CATE_DELETE;
module.exports.PERM_ARTICLE_READ = PERM_ARTICLE_READ;
module.exports.PERM_ARTICLE_CREATE = PERM_ARTICLE_CREATE;
module.exports.PERM_ARTICLE_EDIT = PERM_ARTICLE_EDIT;
module.exports.PERM_ARTICLE_DELETE = PERM_ARTICLE_DELETE;
module.exports.PERM_ALL_CATE = PERM_ALL_CATE;
module.exports.PERM_ALL_ARTICLE = PERM_ALL_ARTICLE;
