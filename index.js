'use strict';
let pivotal = require('pivotaltracker');
let TelegramBot = require('node-telegram-bot-api');
let config = require('./config.json');
let commands = require('./commands');

let botConfig = {
    polling: true
};

let bot = new TelegramBot(config.bot_token, botConfig);

function isGroupChat(msg) {
    return msg.chat.id !== msg.from.id;
}

function reply(message, chatId, force) {
    if (message === undefined) {
        force && bot.sendMessage(chatId, 'Команда не известна, проверь в /help');
    } else if (typeof message === 'string') {
        bot.sendMessage(chatId, message);
    } else {
        message(function(res) {
            bot.sendMessage(chatId, res, {disable_web_page_preview: true});
        })
    }
}

bot.on('text', function(msg) {
    let chatId = msg.chat.id;
    let fromId = msg.from.id;
    let sessionId = fromId + '__' + chatId;
    let result = commands.exec(msg, sessionId);

    reply(result, chatId, ! isGroupChat(msg));
});
