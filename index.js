const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');

const token = '5261788548:AAHgfXdSiUrGeX8xvUXQSkZeaVm2eozevZs'
const bot = new TelegramApi(token, {polling: true})


const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }
    bot.setMyCommands([

        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},

    ])
    if (text === '/start') {

        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/bac/490/bac4908e-f752-300f-b722-3da6737b9b88/1.webp')
        return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Тохировлар`);
    }
    if (text === '/info') {
        await bot.sendMessage(chatId, '8 март бугун Латофатнинг байрами!');
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');

}
start()