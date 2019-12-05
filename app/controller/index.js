const {Controller} = require('iijs');

class Index extends Controller {
    async index() {
        this.assign('title', 'iime - 一个基于iijs构建的简单轻量级blog系统');
        await this.fetch();
    }
}

module.exports = Index;