"use strict";
let path = require('path');
let fs = require('fs');
let commands = require('../utils/commands');

module.exports = {
    message: 'Вывести справку',
    action: function(msg, callback) {
        let commandsList = commands.getList();
        let res = 'Доступные команды: \n';

        commandsList.forEach((message, command) => res += `\t/${command} — ${message}\n`);

        callback(res);
    }
};
