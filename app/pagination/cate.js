const {Pagination} = require('jj.js');

class Cate extends Pagination
{
    init(opts) {
        super.init({
            key_origin: 'params',
            url_index: ':cate',
            url_page: ':cate_page',
            ...opts
        });
        return this;
    }
}

module.exports = Cate;