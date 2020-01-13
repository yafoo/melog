const {app} = require('iijs');

//server
app.run(3001, '0.0.0.0', function(err){
    if(!err) console.log('http server is ready on 3001');
});