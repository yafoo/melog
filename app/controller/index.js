const {Controller, helper} = require('iijs');

class Index extends Controller {
    async index() {
        let readme = await this.view.load('README.md', true);
        readme = helper.md().render(readme);
        readme = readme.replace('</p>', '</p><hr>');
        this.assign('title', 'iime - 一个基于iijs构建的简单轻量级blog系统');
        this.assign('readme', readme);
        await this.fetch();
    }

    async hello() {
        await this.display(`<div style="font-size:50px;">hello iijs, hello world !</div>`);
    }

    async mysql() {
        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getList();
        this.ctx.body = list;
    }
}

module.exports = Index;