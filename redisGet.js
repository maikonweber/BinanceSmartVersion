const redis = require('ioredis');
const l = require('./console.js');

const client = new redis();



client.get('BTCBUSD', (err, result) => {
    console.log(result);
});

client.quit();
