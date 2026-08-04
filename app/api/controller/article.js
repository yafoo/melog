const Base = require('./base');
const TokenModel = require('../../admin/model/token');

class Article extends Base
{
    // 获取文章列表
    async list() {
        const authResult = await this.auth(TokenModel.PERM_ARTICLE_READ);
        if(authResult !== true) return;

        const page = parseInt(this.$request.get('page', 1));
        const rows = parseInt(this.$request.get('rows', 10));
        const cate_id = parseInt(this.$request.get('cate_id', 0));
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
        const authResult = await this.auth(TokenModel.PERM_ARTICLE_READ);
        if(authResult !== true) return;

        const id = this.$request.get('id', 0);
        if(!id) return this.$error('缺少id参数');

        const article = await this.$model.article.get({id});
        if(!article) return this.$error('文章不存在');

        this.$success('success', article);
    }

    // 新增文章
    async create() {
        const authResult = await this.auth(TokenModel.PERM_ARTICLE_CREATE);
        if(authResult !== true) return;

        if(this.ctx.method != 'POST') return this.$error('请使用POST请求');

        const data = this.$request.postAll ? this.$request.postAll() : this.ctx.request.body;
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
        const authResult = await this.auth(TokenModel.PERM_ARTICLE_EDIT);
        if(authResult !== true) return;

        if(this.ctx.method != 'POST') return this.$error('请使用POST请求');

        const data = this.$request.postAll ? this.$request.postAll() : this.ctx.request.body;
        if(!data.id) return this.$error('缺少id参数');

        const id = data.id;
        const article = await this.$model.article.get({id});
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
        const authResult = await this.auth(TokenModel.PERM_ARTICLE_DELETE);
        if(authResult !== true) return;

        const id = this.$request.get('id', 0) || (this.ctx.request.body && this.ctx.request.body.id);
        if(!id) return this.$error('缺少id参数');

        try {
            await this.$db.startTrans(async () => {
                await this.$model.article.del({id});
                await this.$model.comment.del({article_id: id});
            });
            this.$success('删除成功');
        } catch (e) {
            this.$error('删除失败：' + e.message);
        }
    }
}

module.exports = Article;
