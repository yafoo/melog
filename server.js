const {app, Logger} = require('jj.js');

//server
app.run(3003, '0.0.0.0', function(err){
    !err && Logger.info('http server is ready on 3003');
});