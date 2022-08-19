const Base = require('./base');

class Article extends Base
{
    async index() {
        const cate_id = this.ctx.query.cate_id;
        const keyword = this.ctx.query.keyword;

        const condition = {};
        if(cate_id > 0) {
            condition['a.cate_id'] = cate_id;
        }
        if(keyword) {
            condition['concat(a.title, a.writer)'] = ['like', '%' + keyword + '%'];
        }

        const cate_list = await this.$model.cate.getCateList();
        const [list, pagination] = await this.$model.article.getArticleList(condition);

        this.$assign('cate_id', cate_id);
        this.$assign('keyword', keyword);
        this.$assign('cate_list', cate_list);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());
        this.$assign('callback', this.ctx.query.callback || 'callback');

        await this.$fetch();
    }
    
    async form() {
        const cate_list = await this.$model.cate.getCateList();
        const id = parseInt(this.ctx.query.id);
        
        let article = {};
        if(id) {
            article = await this.$model.article.get({id});
        }

        this.$assign('cate_list', cate_list);
        this.$assign('article', article);
        this.$assign('uname', this.user.uname);

        const comment_set_options = [
            {value: 0, name: '跟随系统'},
            {value: 1, name: '强制开启'},
            {value: -1, name: '强制关闭'}
        ];
        this.$assign('comment_set_options', comment_set_options);

        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        const result = await this.$model.article.saveArticle(data);

        if(result) {
            this.$success(id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        
        try {
            await this.$db.startTrans(async () => {
                await this.$model.article.del({id});
                await this.$model.comment.del({article_id: id});
            });
            this.$success('删除成功！', 'index');
        } catch (e) {
            this.$logger.error('删除失败：' + e.message);
            this.$error('删除失败！');
        }
    }
}

module.exports = Article;