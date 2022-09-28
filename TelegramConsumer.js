const amqplib = require('amqplib/callback_api');
const StrategyProccedChannel = require('./ObjectDetect.js');

amqplib.connect('amqp://localhost:5672', async  (err, conn) => {
     if (err) throw err;

     conn.createChannel(async (err, ch2) => {
          if(err) throw err;

     ch2.assertExchange('msg', 'fanout', {
               durable: false
     });

     ch2.assertQueue('msg', {
          exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }

ch2.bindQueue(q.queue, 'msg', '');


let user = {
     usersProfile : {
          name: 'Douglas Moreira',
          number: '5511957895830',
          channel:  'MafiaDaRoleta',
     },
     usersFilters : 
          [
               'Repetição de 9 vezes do Primeiro Bloco',
               `Repetição de 8 vezes do Primeiro Bloco`,
               'Repitição de 9 vezes do Segundo Bloco',
               'Repitição de 9 vezes do Terceira Bloco',
               'Repetição de 9 vezes da Primeira Coluna',
               'Repetição de 9 vezes da Segunda Coluna',
               'Repetição de 9 vezes da Terceira Coluna',
               'Ausencia da Primeira Coluna  - 7 vezes ',
               'Ausencia da Segunda Coluna  - 7 vezes ',
               'Ausencia da Terceira Coluna  - 7 vezes ',
               'Ausencia da Segundo Bloco - 7 vezes ',
               'Ausencia da Terceiro Bloco - 7 vezes ',
               'Ausencia da Primeiro Bloco - 7 vezes ', 
          ],
     userAvailableRoullete : [
          'Türkçe_Lightning_Rulet',
          'Immersive_Roulette',
          'Roulette',
          'American_Roulette',
          'Speed_Roulette',
          'VIP_Roulette',
          'Grand_Casino_Roulette',
          'Lightning_Roulette',
          'Speed_Auto_Roulette',
          'Auto-Roulette_VIP',
          'Auto-Roulette_La_Partage',
          'London_Roulette',
          'Salon_Privé_Roulette',
          'Hippodrome_Grand_Casino',
          'Arabic_Roulette',
          'Speed_Auto_Roulette',
          'French_Roulette_Gold',
          'Dansk_Roulette'
     ],

     usersString : 'Bem Vindo a Mafia da Roleta para Ad',
     usersStringAlert: 'Estrátegia Detectada na ${Roullete}',
     usersStringComprove: 'Entrada Confirmada ${Roulleta}',
     usersStringWin: 'GREEN ${Roulleta} - ${LastResult}',
     usersStringMartingale : 'Martingale - ${Roulleta} - ${LastResult} - ${ExpectNumber}',
     usersStringLoss: 'LOSS - ${Roulleta} - ${LastResult}',
}



const senderEstrategia = new StrategyProccedChannel(user)
// senderEstrategia.init()


ch2.consume(q.queue, async function(msg) {
     if(msg.content) {
     let msgs = msg.content.toString()
     msgs = JSON.parse(msgs)
     senderEstrategia.proccedThisSygnal(msgs);

}
}, { noAck : true} 
);
})
})
})