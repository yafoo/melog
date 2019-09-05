route = [
    {url: '/doc', path: 'app/index/doc'},
    {url: '/hello', path: 'app/index/hello', method: 'get'},
    {url: '/user/:id', path: 'app/index/user', type: 'middle'},
    {url: '/404', path: 'app/base/404', type: 'view'}
];

module.exports = route;