const axios = require('axios');
const Redis = require('ioredis');
const l = require('./console.js');

// const decicionObject = require('./decicionObject.js');
const client = new Redis();
const symbol = 'BTCBUSD';
const interval = '15m';
let tickInterval = 1000 * 60 * 15
let result;
let h1;
console.log('Analisando o Mercado para uma possível movimentação')

   ; (async () => {
      result = await client.get(`${symbol.toLowerCase()}_full_analizer_${interval}`)
      h1 = await client.get(`${symbol.toLowerCase()}_full_analizer_${'1h'}`)
      result = JSON.parse(result)
      h1 = JSON.parse(h1)
      
      const strategyOn = {
         'time' : result['time'],
         'resistencia' : result['resistencia'],
         'suporte' : result['suporte'],
         'curentValor' : result['currentValor']
       }

       const strategyTwo = {
          'time' : result['time'],
          'currentValor' : result['currentValor'],
          'MMA' : result['MMA'],
          'MMA90' : result['MMA99']
       }

      setInterval(async () => {
         // const decicionObject = new decicionObject(false, false, false);
         console.log('Analisando o Mercado para uma possível movimentação')
         result = await client.get(`${symbol.toLowerCase()}_full_analizer_${interval}`);
         result = JSON.parse(result)
         
         const strategyOn = {
           'time' : result['time'],
           'resistencia' : result['resistencia'],
           'suporte' : result['suporte'],
           'curentValor' : result['currentValor']
         }

         const strategyTwo = {
            'time' : result['time'],
            'currentValor' : result['currentValor'],
            'MMA' : result['MMA'],
            'MMA90' : result['MMA99']
         }

         // decisionObject(result['currentValor'], result[''])

         //console.log(suporte, resistencia, MMA10, MMA30)
      }, tickInterval);


   })()

