const TelegramBot = require('node-telegram-bot-api');
const { mod } = require('telegram/Helpers');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.telegram_bot;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: false});

async function sendTelegram (msg) {
    console.log("Enviando mensagem a Telegram");
    bot.sendMessage(1830205937, msg);
}


bot.onText(/\/echo (.+)/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message
      const chatId = msg.chat.id;
      console.log(chatId);
      const resp = match[1]; // the captured "whatever"
    
      // send back the matched "whatever" to the chat
      bot.sendMessage(chatId, resp);
    });


    module.exports = sendTelegram;















module.exports = {
    sendTelegram
}






// Send message to a chat

// bot.sendMessage(chatId, 'Hello world');

// bot.sendMessage(chatId, 'Received your message');

// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
  
//   const chatId = msg.chat.id;
//   console.log(chatId);
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message 1', :chatId);
// });
