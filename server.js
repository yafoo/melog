const app = require('./lib/app');

//server
app.listen(3000, '0.0.0.0', function(err){
    if(!err) console.log('http server is ready on 3000');
});