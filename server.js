const {App, Logger} = require('jj.js');

//server
const port = 3003;
const app = new App();
app.listen(port, function(err){
    !err && Logger.system('http server is ready on', port);
});