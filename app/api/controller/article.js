const Base = require('./base');

class Article extends Base
{
    // 获取文章列表
    async list() {
        const page = this.$request.get('page', 1);
        const rows = this.$request.get('rows', 10);
        const cate_id = this.$request.get('cate_id', 0);
        const keyword = this.$request.get('keyword', '');

        const condition = {};
        if(cate_id > 0) {
            condition['a.cate_id'] = cate_id;
        }
        if(keyword) {
            condition['concat(a.title, a.writer)'] = ['like', '%' + keyword + '%'];
        }

        const [list, pagination] = await this.$model.article.getArticleList(condition);
        this.$success('success', {list, page, rows, total: pagination ? pagination.total : 0});
    }

    // 获取文章详情
    async detail() {
        const id = this.$request.get('id', 0);
        if(!id) return this.$error('缺少id参数');

        const article = await this.$model.article.get({id});
        if(!article) return this.$error('文章不存在');

        this.$success('success', article);
    }

    // 新增文章
    async create() {
        if(!this.$request.isPost()) return this.$error('请使用POST请求');

        const data = this.$request.postAll();
        if(!data.title) return this.$error('标题不能为空');
        if(!data.cate_id) return this.$error('分类不能为空');

        data.user_id = this.tokenInfo.user_id;
        data.add_time = this.$utils.time();
        data.click = data.click || 0;

        const result = await this.$model.article.saveArticle(data);
        if(result) {
            this.$success('新增成功', {id: result});
        } else {
            this.$error('新增失败');
        }
    }

    // 编辑文章
    async edit() {
        if(!this.$request.isPost()) return this.$error('请使用POST请求');

        const data = this.$request.postAll();
        if(!data.id) return this.$error('缺少id参数');

        const article = await this.$model.article.get({id: data.id});
        if(!article) return this.$error('文章不存在');

        data.update_time = this.$utils.time();

        const result = await this.$model.article.saveArticle(data);
        if(result) {
            this.$success('保存成功');
        } else {
            this.$error('保存失败');
        }
    }

    // 删除文章
    async delete() {
        const id = this.$request.query('id', 0);
        if(!id) return this.$error('缺少id参数');

        try {
            await this.$db.startTrans(async () => {
                await this.$model.article.del({id});
                await this.$db.table('comment').delete({article_id: id});
            });
            this.$success('删除成功');
        } catch (e) {
            this.$error('删除失败：' + e.message);
        }
    }
}

module.exports = Article;
