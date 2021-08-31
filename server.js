const {app} = require('jj.js');

//server
app.run(3003, '127.0.0.1', function(err){
    if(!err) console.log('http server is ready on 3003');
});