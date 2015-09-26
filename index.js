'use strict';
let pivotal = require('pivotaltracker');
let TelegramBot = require('node-telegram-bot-api');
let config = require('./config.json');

let botConfig = {
    polling: true
};

let bot = new TelegramBot(config.bot_token, botConfig);

function isCommand(text) {
    return text.startsWith('/');
}

function getCommand(text) {
    let commandName = text.split(' ')[0].split("@")[0];
    let command;

    try {
        command = require(`./commands/${ commandName }`);
    } catch (e) {
        command = require('./commands/help');
    }

    return command;
}

function getMessage(text) {
    let index = text.indexOf(' ');

    if (index !== -1) {
        return text.substr(index);
    } else {
        return '';
    }
}

bot.on('text', function(msg) {
    let chatId = msg.chat.id;
    let text = msg.text;

    if (isCommand(text)) {
        let command = getCommand(text);
        let message = getMessage(text);

        command.action(message, (result) => bot.sendMessage(chatId, result));
    } else {
        let result = 'Ниччё не понимаю, попробуй /help';

        bot.sendMessage(chatId, result);
    }
});
