const {utils} = require('iijs');
const dateFormat = (value, format) => utils.date.format(format, value);
const urlC = (folder) => `/${folder}/`;
const urlA = (id) => `/a/${id}.html`;

module.exports = {dateFormat, urlC, urlA,
    view_filter: {dateFormat, urlC, urlA}
}