const Base = require('./base');

class Article extends Base
{
    async index() {
        const condition = {};
        const keyword = this.ctx.query.keyword;
        if(keyword !== undefined) {
            condition['concat(a.title, a.writer)'] = ['like', '%' + keyword + '%'];
        }
        const [total, list] = await this.$model.article.getArticleList(condition);
        const pagination = total ? this.$pagination.render(total) : '';
        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination);
        await this.$fetch();
    }
    
    async add() {
        const cate_list = await this.$model.cate.getCate();
        const id = parseInt(this.ctx.query.id);
        let article = {};
        if(id) {
            article = await this.$model.article.getOne({id});
        }

        this.$assign('cate_list', cate_list);
        this.$assign('article', article);

        const comment_option = [
            {value: 0, name: '默认'},
            {value: 1, name: '开启'},
            {value: -1, name: '关闭'}
        ];
        this.$assign('comment_option', comment_option);

        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const aid = data.id;
        delete data.id;
        if(aid) {
            const result = await this.$model.article.update(data, {id: aid});
            if(result) {
                this.$success('保存成功！', 'index');
            } else {
                this.$error('保存失败！');
            }
        } else {
            const result = await this.$model.article.add(data);
            if(result) {
                this.$success('新增成功！', 'index');
            } else {
                this.$error('保存失败！');
            }
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        
        try {
            await this.db.startTrans(async () => {
                await this.$model.article.delete({id});
                await this.$model.comment.delete({article_id: id});
            });
            this.$success('删除成功！', 'index');
        } catch (e) {
            this.$error('删除失败！');
        }
    }
}

module.exports = Article;