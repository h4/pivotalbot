"use strict";
let pivotal = require('pivotaltracker');
let token = require('../config.json').pivotal_token;
let projectId = require('../config.json').project_id;

let client = new pivotal.Client(token);

let requestHandler = function(callback) {
    return function(err, res) {
        if (err) {
            return callback(`Не удалось создать задачу\n${err.error}`);
        }

        return callback(`Задача создана.\n${res.url}`);
    }
};

let postStory = function (params) {
    return function (callback) {
        let handler = requestHandler(callback);

        client.project(projectId)
            .stories
            .create({
                name: params.name,
                storyType: 'bug',
                labels: ['bug']
            }, handler);
    };
};

module.exports = {
    message: 'Завести новый баг',
    action: function*(msg) {
        if (! msg) {
            msg = yield 'Введи краткое описание';
        }

        yield postStory({name: msg});
    }
};
