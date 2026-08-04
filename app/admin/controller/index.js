const Base = require('./base');
const pkg = require('../../../package.json');

class Index extends Base
{
    async index() {
        // 系统数据统计
        const [article, cate, comment, upload, link, user] = await Promise.all([
            this.$model.article.db.count(),
            this.$model.cate.db.count(),
            this.$model.comment.db.count(),
            this.$model.upload.db.count(),
            this.$model.link.db.count(),
            this.$model.user.db.count()
        ]);
        this.$assign('count', {article, cate, comment, upload, link, user});

        // 最新文章
        const recent_articles = await this.$db.table('article a')
            .field('a.id,a.title,a.add_time,a.click,c.cate_name')
            .join('cate c', 'a.cate_id=c.id')
            .order('a.id', 'desc').limit(5).select();
        recent_articles.forEach(item => {
            item.date = this.$utils.date('m-d H:i', item.add_time);
        });

        // 最新评论
        const recent_comments = await this.$db.table('comment c')
            .field('c.id,c.uname,c.content,c.add_time,a.title')
            .join('article a', 'c.article_id=a.id')
            .order('c.id', 'desc').limit(5).select();
        recent_comments.forEach(item => {
            item.date = this.$utils.date('m-d H:i', item.add_time);
        });

        this.$assign('recent_articles', recent_articles);
        this.$assign('recent_comments', recent_comments);
        this.$assign('sys', {
            melog_version: pkg.version,
            node_version: process.version,
        });

        this.$assign('title', '仪表盘');
        await this.$fetch();
    }

    async login() {
        if(this.$request.isPost()) {
            const username = this.$request.post('username');
            const password = this.$request.post('password');
            if(!username) {
                this.$error('用户名不能为空！');
            } else if(!password) {
                this.$error('密码不能为空！');
            }

            const err = await this.$model.user.login(username, password);
            if(err) {
                this.$error(err);
            } else {
                this.$success('登录成功！', 'index');
            }
        } else {
            this.$assign('title', '登录');
            await this.$fetch();
        }
    }

    async logout() {
        await this.$model.user.logout();
        this.$success('退出成功！', 'index')
    }

    async register() {
        this.$error('注册功能未开放！');
    }
}

module.exports = Index;