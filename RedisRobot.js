const moment = require('moment');
let { getCandleStatistc } = require('./candles.js');
const { ifHaveCoin } = require('./api.js');
const { checkHaveOrder } = require('./api.js');
const { cancallAllOpenOrder } = require('./api.js');
const { newOCO, newOrder } = require('./api.js');
const WebSocket = require('ws');
const { roundToTwo } = require('./candles.js');
const { allOrders } = require('./api.js');
const { insertOrder } = require('./db.js');
const { verifyLastOrder } = require('./db.js');
const { sendTelegram } = require('./telegram.js');

const convertObj = {
    '1m' : 60 * 1000,
    '5m' : 5 * 60 * 1000,
    '15m' : 15 * 60 * 1000,
    '30m' : 30 * 60 * 1000,
    '1h' : 60 * 60 * 1000,
    '2h' : 2 * 60 * 60 * 1000,
}



class Robot {
    constructor(symbol, time, interval) {
        this.interval = interval;
        this.symbol = symbol;
        this.time = time;
        this.currentValor = 0;
        this.timeConvert = convertObj[time];
        this.lastStactis = {};
        this.CurrentTime;
    }

    async Init() {
        console.log('Starting - ' + this.symbol + ' - ' + this.time + ' - ' + this.interval);
        await this.getStrem();
        await this.logger();   
        await this.statist();
    }

    async statist() {
        console.log('statist');
        let candle = await getCandleStatistc(this.syngal, this.time, this.interval);
        this.lastStactis = candle;
        console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
        this.CurrentTime = this.lastStactis.time;

        setInterval(async () => {
            let candle = await getCandleStatistc(this.syngal, this.time, this.interval);
            this.lastStactis = candle;
            console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
            this.CurrentTime = this.lastStactis.time;
         }, this.timeConvert);    
    }
    

    async logger () {
       setInterval(() => {
        console.log('Logger')
        console.log(this.currentValor)
        console.log(this.lastStactis.time)
        }, 11000);
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getStrem() {
        const time = '1m'
        const Symbol  = (this.symbol).toLowerCase();
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/' + Symbol + '@kline_' + time);
          ws.on('message', (data) => {

              if (data) {
                  const trade = JSON.parse(data);
                  const btc = {
                      symbol: trade.s,
                      time: moment(trade.k.t).format('YYYY-MM-DD HH:mm:ss'),
                      open: trade.k.o,
                      close: trade.k.c,
                      high: trade.k.h,
                      low: trade.k.l,
                      volume: trade.k.v,
                  }
               
                  this.currentValor = roundToTwo(btc.close);
                  
              }
          });
    }   
}


module.exports = Robot;

