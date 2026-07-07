const app = {
    app_debug: false, //调试模式
    default_deep: 'app', //默认应用深度
    static_dir: './public', //静态文件目录，相对于应用根目录，为空或false时，关闭静态访问
    koa_body: {multipart: true, formidable: {keepExtensions: true, maxFieldsSize: 10 * 1024 * 1024}} //koa-body配置参数，为false时，关闭koa-body
}

module.exports = app;