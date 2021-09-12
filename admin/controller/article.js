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
        if(keyword !== undefined) {
            condition['concat(a.title, a.writer)'] = ['like', '%' + keyword + '%'];
        }

        const cate_list = await this.$model.cate.getCate();
        const [list, pagination] = await this.$model.article.getArticleList(condition);

        this.$assign('cate_id', cate_id);
        this.$assign('keyword', keyword);
        this.$assign('cate_list', cate_list);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());

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