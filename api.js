const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const moment = require('moment');
const WebSocket = require('ws');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const Api_url = process.env.API_URL;

async function getStreamPrices(Symbol = 'btcbusd'){

    // symbol string mandatory

   
    }

      

async function privateCall(path, data = {}, method = 'GET') {
    const timestamp = Date.now();
    const signature = crypto.createHmac('sha256', apiSecret)
                     .update(`${querystring.stringify({...data, timestamp})}`)
                     .digest('hex');
    
    const newData = {...data, timestamp, signature};
    const qs = `?${querystring.stringify(newData)}`;

    try {
        const result = await axios({
            method,
            url: `${Api_url}${path}${qs}`,
            headers: {'X-MBX-APIKEY': apiKey}           
        });
        return result.data;

    } catch(err) {
        console.log(err);
    }
}


//GET /api/v3/allOrders (HMAC SHA256)
//  


async function publicCall(path, data, method = 'GET') {
    try {
        const qs = data ? `?${querystring.stringify(data)}` : '';
        const result = await axios({
            method: method,
            url: `${process.env.API_URL}${path}${qs}`,
        });
        return result.data;

    } catch(err) {
        console.log(err);
    }

}

async function time(){
    return publicCall('/v3/time');
}

async function depth(symbol = 'BTCBUSD', limit = 5){
    return publicCall('/v3/depth', {symbol, limit});
}

async function exchangeInfo(){
    
    return publicCall('/v3/exchangeInfo');
}

async function accountInfo(){
    return privateCall('/v3/account');
}

// Kline 5 min

async function kline(symbol = 'BTCBUSD', interval = '5m', limit = 10){    
    return publicCall('/v3/klines', {symbol, interval, limit});
}

async function ticker(symbol = 'BTCBUSD'){
    return publicCall('/v3/ticker/24hr', {symbol});
}




module.exports = {
    time, 
    depth,
    exchangeInfo,
    accountInfo,
    kline,
    getStreamPrices

};