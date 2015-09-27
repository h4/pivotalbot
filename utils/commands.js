"use strict";
let fs = require('fs');
let path = require('path');
let commandsPath = '../commands/';
let commandsRoot = path.resolve(__dirname, commandsPath);

function getCommandsList() {
    return fs.readdirSync(commandsRoot)
        .map((fname) => path.basename(fname, '.js'));
}

module.exports = {
    getList: function() {
        let commands = new Map();

        getCommandsList()
            .filter((fname) => fname !== 'index')
            .forEach((fname) => {
                let module = require(commandsPath + fname);

                commands.set(fname, module.message);
            });

        return commands;
    }
};
