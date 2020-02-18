const {utils} = require('iijs');
const dateFormat = (value, format) => utils.date.format(format, value);

module.exports = {dateFormat,
    view_filter: {dateFormat, Date}
}