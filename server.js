const {App, Logger} = require('jj.js');

// 忽略客户端提前断开连接的错误
process.on('uncaughtException', (err) => {
    // @ts-ignore
    if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') return;
    throw err;
});

//server
const port = 3003;
const app = new App();
app.listen(port, function(err){
    !err && Logger.system('http server is ready on', port);
});