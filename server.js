const {app, Logger} = require('jj.js');

//server
app.run(3003, '127.0.0.1', function(err){
    !err && Logger.info('http server is ready on 3003');
});