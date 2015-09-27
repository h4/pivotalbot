'use strict';

let pivotal = require('pivotaltracker');
let token = require('../config.json').pivotal_token;

let client = new pivotal.Client(token);

module.exports = {
    client: client
};
