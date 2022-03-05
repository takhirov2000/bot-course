const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions}=require('./options')


const token = '5261788548:AAHgfXdSiUrGeX8xvUXQSkZeaVm2eozevZs'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {

    await bot.sendMessage(chatId, `сейчас загадываю цифру от 0 до 9 а ты должен угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'начальное приветсвие'},
        {command: '/info', description: 'информация'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/bac/490/bac4908e-f752-300f-b722-3da6737b9b88/1.webp')
            return bot.sendMessage(chatId, `добро пожаловать к каналу Тохирова `)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);

        }
        return bot.sendMessage(chatId, `я тебя не понимаю, попробовай еще раз ${msg.from.first_name} ${msg.from.last_name}`);

    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);

        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `поздравляю ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `к сожалению ты не угадал ${data}, бот загадал цифру ${chats[chatId]}`, againOptions);
        }

    })
}
start()