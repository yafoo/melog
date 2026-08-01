const routes = [
    {url: '/', path: 'app/index/index'},
    {url: '/article/:id.html', path: 'app/article/article', name: 'article'},
    {url: '/search', path: 'app/search/search', name: 'search'},
    {url: '/install', path: 'install/index/index'},
    {url: '/admin', path: 'admin/index/index'},
    {url: '/:cate/', path: 'app/cate/cate', name: 'cate'}, // 会匹配到admin|install等地址，所以程序内需执行this.$next()
    {url: '/:cate/list_:page.html', path: 'app/cate/cate', name: 'cate_page'},
];

module.exports = routes;