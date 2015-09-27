'use strict';

function getCommandName(rawCommandName) {
    return rawCommandName.split(' ')[0].split("@")[0].substr(1);
}

function getMessage(text) {
    let index = text.indexOf(' ');

    if (index !== -1) {
        return text.substr(index);
    } else {
        return '';
    }
}

const sessions = new Map();

module.exports = {
    isCommand: function(text) {
        return text && text.startsWith('/');
    },

    exec: function(msg, sessionId) {
        let text = msg.text;
        let action;
        let result;

        if (this.isCommand(text)) {
            let command = this.get(text);
            let message = getMessage(msg.text);

            action = command.action(message, msg.message_id);
            result = action.next();

            sessions.set(sessionId, action);
        } else if (sessions.has(sessionId)) {
            action = sessions.get(sessionId);
            result = action.next(text, msg.message_id);
        }

        return result && result.value;
    },

    get: function(commandName) {
        let command;

        try {
            command = require('./' + getCommandName(commandName));
        } catch (e) {
            command = require('./help');
        }

        return command;
    }
};
