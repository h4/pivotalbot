'use strict';
let pivotal = require('pivotaltracker');
let TelegramBot = require('node-telegram-bot-api');
let config = require('./config.json');

let botConfig = {
    polling: true
};

let bot = new TelegramBot(config.bot_token, botConfig);

function isCommand(msg) {
    return msg.text && msg.text.startsWith('/');
}

function isGroupChat(msg) {
    return msg.chat.id !== msg.from.id;
}

function getCommand(text) {
    let commandName = text.split(' ')[0].split("@")[0];
    let command;

    try {
        command = require(`./commands/${ commandName }`);
    } catch (e) {
        console.log(e);
        command = require('./commands/help');
    }

    return command;
}

function sendCommand(msg) {
    let chatId = msg.chat.id;
    let fromId = msg.from.id;
    let sessionId = fromId + '__' + chatId;

    let command = getCommand(msg.text);
    let message = getMessage(msg.text);

    let action = command.action(message);

    let result = action.next();

    sessions.set(sessionId, action);

    return result.value;
}

function getMessage(text) {
    let index = text.indexOf(' ');

    if (index !== -1) {
        return text.substr(index);
    } else {
        return '';
    }
}

function reply(message, chatId, force) {
    if (message === undefined && force) {
        bot.sendMessage(chatId, 'Ниччё не понимаю, попробуй /help');
    } else if (typeof message === 'string') {
        bot.sendMessage(chatId, message);
    } else {
        message(function(res) {
            bot.sendMessage(chatId, res, {disable_web_page_preview: true});
        })
    }
}

let sessions = new Map();

bot.on('text', function(msg) {
    let chatId = msg.chat.id;
    let fromId = msg.from.id;
    let sessionId = fromId + '__' + chatId;
    let result;

    if (isCommand(msg)) {
        result = sendCommand(msg);
    } else {
        if (sessions.has(sessionId)) {
            let action = sessions.get(sessionId).next(msg.text);

            result = action.value;
        }
    }

    reply(result, chatId, ! isGroupChat(msg));
});
