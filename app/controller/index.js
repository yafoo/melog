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
        const db = this.ctx.loader.config.db;
        await db('select * from link').then(function(data){
            this.ctx.body = data;
        }).catch(function(err){
            console.log(err);
            this.ctx.body = data;
        });
    }
}

module.exports = Index;