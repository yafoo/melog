const {utils} = require('iijs');

module.exports = {
    dateFormat: function(value, format) {return utils.date.format(format, value);}
}