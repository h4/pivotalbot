"use strict";
let pivotal = require('pivotaltracker');
let token = require('../config.json').pivotal_token;
let projectId = require('../config.json').project_id;

let client = new pivotal.Client(token);

function requestHandler(callback) {
    return function(err, story) {
        if (err) {
            callback('Не удалось создать запрос:\n' + err.error);
        } else {
            callback('Баг-репорт получен, его адрес: ' + story.url);
        }
    }
}

module.exports = {
    message: 'Завести новый баг',
    action: function(msg, callback) {
        let handler = requestHandler(callback);

        if (msg.length === 0) {
            callback('Нужно хоть как-то описать баг');
            return;
        }

        client.project(projectId)
            .stories
            .create({
                name: msg,
                storyType: 'bug',
                labels: ['bug']
            }, handler);
    }
};
