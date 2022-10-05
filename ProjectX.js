const axios = require('axios');
const Redis = require('ioredis');
const l = require('./console.js');


;(async () => {
   const full_candle = await client.get(`${symbol.toUpperCase()}_candle_${interval}`);
   console.log(full_candle);
   
})()
