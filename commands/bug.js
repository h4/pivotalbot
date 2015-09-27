"use strict";
let projectId = require('../config.json').project_id;

let fs = require('fs');
let path = require('path');
let pivotal = require('../utils/pivotal');
let client = pivotal.client;


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

        client.project(params.project.id)
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

        /**
         * @type Array
         */
        let projects = require('../projects.json');
        let projectNames = projects.map((proj) => ( [ proj.name ] ));

        let projectName = yield {
            text: 'Выбери проект',
            params: {
                reply_markup: JSON.stringify({
                    keyboard: projectNames,
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    selective: true
                })
            }
        };

        let project = projects.find((proj) => proj.name === projectName);

        if (! project) {
            return {
                text: `Не удалось создать задачу.\nПроект "${projectName}" не найден`,
                params: {
                    reply_markup: JSON.stringify({
                        hide_keyboard: true
                    })
                }
            }
        }

        yield postStory({name: msg, project: project});
    }
};
