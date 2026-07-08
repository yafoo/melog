const routes = [
    {url: '/', path: 'app/index/index'},
    {url: '/article/:id.html', path: 'app/article/article', name: 'article'},
    {url: '/search', path: 'app/search/search', name: 'search'},
    {url: '/special/:id.html', path: 'app/special/special', name: 'special'},
    {url: '/:cate((?!admin|install)[^/]+)/', path: 'app/cate/cate', name: 'cate'}, // 会匹配到自定义后台地址，所以程序内需执行this.$next()
    {url: '/:cate((?!admin|install)[^/]+)/list_:page.html', path: 'app/cate/cate', name: 'cate_page'},
    {url: '/admin', path: 'admin/index/index'},
];

module.exports = routes;