const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const moment = require('moment');
const WebSocket = require('ws');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const Api_url = process.env.API_URL;



const roundToTwo = num => +(Math.round(num + "e+2")  + "e-2");

console.log(apiKey, apiSecret, Api_url);
async function getStreamPrices(Symbol = 'maticbusd'){
  
    }

    getStreamPrices();
     

async function privateCall(path, data = {}, method = 'GET') {
    const timestamp = moment().valueOf();
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

async function cancallAllOpenOrder(symbol){
    return privateCall('/v3/openOrders', {symbol: symbol}, 'DELETE');
}

async function newOCO(symbol, quantity, price, side = 'BUY', stopPrice = 0, stopLimitPrice = 0, timeInForce = 'FOK') {
    const data  = {
        symbol : symbol, 
        side : side, 
        quantity : quantity,
        stopPrice : stopPrice,
        stopLimitPrice : stopLimitPrice,
        price: price,
        stopLimitTimeInForce: timeInForce
    };

    console.log(data);

     return privateCall('/v3/order/oco', data, 'POST');    
} 

async function checkHaveOrder(symbol = 'BTCBUSD'){
    return privateCall('/v3/openOrders', {symbol}, 'GET');

}

async function newOrder(symbol, quantity, side,  type = 'MARKET', price) {
    const data  = {
        symbol : symbol,
        side : side,
        quantity : quantity,
        type : type,
    };
    if (price) data.price = price
    if (type === 'LIMIT') data.timeInForce = 'GTC';
    
     return privateCall('/v3/order', data, 'POST');    
} 

// async function checkHaveOrder(symbol = 'BTCBUSD'){
//     return privateCall('/v3/openOrders', {symbol}, 'GET');

// }

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

async function allCoin(symbol = 'BTCBUSD'){

    return privateCall('/sapi/v1/capital/config/getall', {symbol}, 'GET');
}

async function ifHaveCoin(symbol) {
    const account = await accountInfo();    
    const coin = account.balances.filter(coin => symbol.indexOf(coin.asset) > -1);
    const coin_list = coin.map(coin => coin.asset);
    
    return coin;
    };

async function allOrders(symbol = 'BTCBUSD') {
    return privateCall('/v3/allOrders', {symbol}, 'GET');
}

// (async () => {
//     const symbol = 'BTCBUSD';
//    const account = await accountInfo();
//    console.log(account);
   
// })();

module.exports = {
    time, 
    depth,
    exchangeInfo,
    accountInfo,
    kline,
    getStreamPrices,
    ticker,
    cancallAllOpenOrder,
    newOrder,
    ifHaveCoin,
    checkHaveOrder,
    newOCO,
    allOrders,
};