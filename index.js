const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

const token = '5261788548:AAHgfXdSiUrGeX8xvUXQSkZeaVm2eozevZs'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {

    await bot.sendMessage(chatId, `сейчас загадываю цифру от 0 до 9 а ты должен угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}
const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('подключение к бд сломалось', e)

    }
    bot.setMyCommands([
        {command: '/start', description: 'начальное приветсвие'},
        {command: '/info', description: 'информация'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/bac/490/bac4908e-f752-300f-b722-3da6737b9b88/1.webp')
                return bot.sendMessage(chatId, `добро пожаловать к каналу Тохирова `)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right},в игре у тебя НЕправильных ответов ${user.wrong},`);
            }
            if (text === '/game') {
                return startGame(chatId);

            }
            return bot.sendMessage(chatId, `я тебя не понимаю, попробовай еще раз ${msg.from.first_name} ${msg.from.last_name}`);

        } catch (e) {
            return bot.sendMessage(chatId, 'произошла ощибка не по плану')
        }
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);

        }
        const user = await UserModel.findOne({chatId})

        if (data == chats[chatId]) {
            user.right += 1;

            await bot.sendMessage(chatId, `поздравляю ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `к сожалению ты не угадал ${data}, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();

    })
}
start()