const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const input = require('input')

const apiId = 17228434;
const apiHash = 'b05e1c84ad4dd7c77e9965204c016a36'

const stringSession = new StringSession('');
const Redis = require('ioredis');




const client = new TelegramClient(stringSession, apiId, apiHash,  {
    connectionRetries: 5,
})

const redis = new Redis();


async function sendMsg(sala, msg, reply) {
    if(!reply) {
        const salaEntity = await client.getEntity(sala);
        return await client.invoke ( new Api.messages.SendMessage({
            peer: salaEntity,
            messages: msg.ToString()
        }))
    } else {
        console.log('Reply')
        console.log(reply.updates[0].SUBCLASS_OF_ID);
        const salaEntity = await client.getEntity(sala);
        return await client.invoke(new Api.messages.SendMessage({
            peer : salaEntity,
            message: msg.toString(),
            replyToMsgId : reply.updates[0].id
        }))
    }
}
;(async () => {

await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
    
  });

const result = await client.invoke( new Api.messages.GetAllChats({
    exceptIds : [43]
}));

for(let i = 0; i < result.chats.length; i++){
  console.log(result.chats[i].id, result.chats[i].title)
}

console.log(client.session.save());

})();

