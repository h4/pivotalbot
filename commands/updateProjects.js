'use strict';
let fs = require('fs');
let path = require('path');
let pivotal = require('../utils/pivotal');
let client = pivotal.client;
let projectsList = path.resolve(__dirname, '../projects.json');


let requestHandler = function(callback) {
    return function(err, res) {
        if (err) {
            return callback(`Не обновить список проектов\n${err.error}`);
        }

        let projects = res.map((raw) => ({id: raw.id, name: raw.name}));

        fs.writeFileSync(projectsList, JSON.stringify(projects));

        return callback(`Список проектов обновлён.\n`);
    }
};

let update = function (params) {
    return function (callback) {
        let handler = requestHandler(callback);

        client.projects.all(handler);
    };
};

module.exports = {
    message: 'Обновить список проектов',
    action: function*() {
        yield update();
    }
};