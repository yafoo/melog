const {Pagination} = require('jj.js');

class Index extends Pagination
{
    init(opts) {
        super.init({
            url_index: '/',
            ...opts
        });
        return this;
    }
}

module.exports = Index;