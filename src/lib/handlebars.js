const { format } = require('timeago.js');

const helpers = {}; //Objeto que se puede utilizar desde las vistas

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;