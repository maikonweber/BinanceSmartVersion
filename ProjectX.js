const axios = require('axios');
const Redis = require('ioredis');
const l = require('./console.js');

// const decicionObject = require('./decicionObject.js');
const client = new Redis();
const symbol = 'BTCBUSD';
const interval = '1h';
const tickInterval = 15000;



setInterval(async () => {
   // const decicionObject = new decicionObject(false, false, false);
   console.log('Analisando o Mercado para uma possível movimentação')
   let result = await client.get(`${symbol.toLowerCase()}_full_analizer_${interval}`);
   result = JSON.parse(result);
   // et ////[suporte, resistencia, MMA10, MMA30 ] = result
   if (result.currentValor >= result.MMA) {
      console.log('Valor Atual Maior que Media de 10 periodo');
   } else {
      console.log('O Valor esta abaixo da MMA10')
   }
   if (result.currentValor >= result.MMA30) {
      console.log('O valor da esta maior que MMA30')
   } else {
      console.log('O valor está abaixo da MMA30')
   }
   if (result.RSI <= 30) {
      console.log('O preço está sobre vendido')
   }

   if (result.RSI >= 60) {
      console.log('O preço está sobrecomprado');
   }


   //console.log(suporte, resistencia, MMA10, MMA30)
}, tickInterval);

setInterval(async () => {
   console.log('Analisando o Mercado para uma possível movimentação')
   let result = await client.get(`${symbol.toLowerCase()}_full_analizer_${'15m'}`);
   result = JSON.parse(result);
   // et ////[suporte, resistencia, MMA10, MMA30 ] = result
   if (result.currentValor >= result.MMA) {
      console.log('Valor Atual Maior que Media de 10 periodo');
   } else {
      console.log('O Valor esta abaixo da MMA10')
   }

   if (result.currentValor >= result.MMA30) {
      console.log('O valor da esta maior que MMA30')
   } else {
      console.log('O valor está abaixo da MMA30')
   }
   if (result.RSI <= 30) {
      console.log('O preço está sobre vendido')
   }

   if (result.RSI >= 60) {
      console.log('O preço está sobrecomprado');
   }


   //console.log(suporte, resistencia, MMA10, MMA30)
}, tickInterval);
