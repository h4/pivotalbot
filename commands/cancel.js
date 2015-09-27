'use strict';

module.exports = {
    message: 'Отменить создание задачи',
    action: function*() {
        yield 'Создание задачи отменено';
    }
};