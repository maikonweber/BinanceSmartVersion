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
const Redis = require('ioredis');

const l = require('./console.js');

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
        this.suporte = 0;
        this.resistencia = 0;
        this.CurrentTime;
        this.RSA;
        this.MMA;
        this.MMA10;
        this.MMA20;
        this.MMA30;
        this.MMA40;
        this.BUY = true;
        this.tendenciaHistory = [];
        this.Fbuy = false;
        this.suportMMA  = 0;
        this.resistMMA = 0;
        this.SellVolume = 0;
        this.BuyVolume = 0;
        this.senderAnalizer = {};
        this.MMAARRAY = [];
        this.touchArrayMMA = []

    }

    async Init() {
        console.log('Starting - ' + this.symbol + ' - ' + this.time + ' - ' + this.interval);
        await this.initRedis();
        await this.getStrem();
        await this.logger();   
        await this.statist();
        await this.getFullAnalisys();
        await this.analyzerRangeTouchMMA();
    }

    async statist() {
        console.log('statist');
        let candle = await getCandleStatistc(this.symbol, this.time, this.interval);
        this.lastStactis = candle;
        console.log("\x1b[31m",'Atualizando valores de ', this.symbol);
        this.CurrentTime = this.lastStactis.time;
        this.suporte =  this.lastStactis.supAndRes100.Suporte
        this.resistencia = this.lastStactis.supAndRes100.Resistencia
        this.MMA = this.lastStactis.MMA3;
        this.MMA10 = this.lastStactis.MMA10;
        this.MMA30 = this.lastStactis.MMA30;
        this.MMA99 = this.lastStactis.MMA99;
        this.RSI = this.lastStactis.RSI;
        this.suportMMA = this.lastStactis.MMA99;
        this.resistMMA = this.lastStactis.MMA30;
        this.SellVolume = this.lastStactis.SellVolume;
        this.BuyVolume = this.lastStactis.BuyVolume;

        setInterval(async () => {
            const candle = await getCandleStatistc(this.syngal, this.time, this.interval);
            this.lastStactis = candle;
            this.suporte = this.lastStactis.supAndRes100.Suporte
            this.resistencia = this.lastStactis.supAndRes100.Resistencia
            this.SellVolume = this.lastStactis.SellVolume;
            this.BuyVolume = this.lastStactis.BuyVolume;

            const atulizer = {
                symbol: this.symbol,
                time: this.lastStactis.time,
                close: this.lastStactis.close,
                suporte: this.suporte,
                resistencia: this.resistencia,
                SellVolume: this.SellVolume,
                BuyVolume: this.BuyVolume,
            }

            await this.redis.set(`${this.symbol.toLowerCase()}_current_analizer_${this.time}`, JSON.stringify(atulizer));

            
        }, 6000)            

        setInterval(async () => {
            let candle = await getCandleStatistc(this.syngal, this.time, this.interval);
            this.lastStactis = candle;
            this.CurrentTime = this.lastStactis.time;
            this.suporte =  this.lastStactis.supAndRes100.Suporte
            this.resistencia = this.lastStactis.supAndRes100.Resistencia
            this.MMA = this.lastStactis.MMA3;
            this.MMA10 = this.lastStactis.MMA10;
            this.MMA30 = this.lastStactis.MMA30;
            this.MMA99 = this.lastStactis.MMA99;
            this.RSI = this.lastStactis.RSI;
            this.SellVolume = this.lastStactis.SellVolume;
            this.BuyVolume = this.lastStactis.BuyVolume;

            const analyzer = {
                time: this.CurrentTime,
                symbol: this.symbol,
                suporte: this.suporte,
                resistencia: this.resistencia,
                MMA: this.MMA,
                MMA10: this.MMA10,
                MMA30: this.MMA30,
                MMA99: this.MMA99,
                RSI: this.RSI,
                suportMMA: this.suportMMA,
                resistMMA: this.resistMMA,
                SellVolume: this.SellVolume,
                BuyVolume: this.BuyVolume,
            }
        
            this.redis.set(`${this.symbol}_candle_${this.time}`, JSON.stringify(analyzer));
         }, this.timeConvert);

    }
    
    async logger () {
        setInterval( async () => {
        const mock = Math.round(this.MMA30) 
        if (this.MMA30 > this.MMA10) {
            l('red', ['MMA30 > MMA10', this.MMA30, this.MMA10]);
            this.senderAnalizer.MMA30_UP_MM10 = true
        } else {
            l('green', ['MMA30 < MMA10', this.MMA30, this.MMA10]);
            this.senderAnalizer.MMA30_UP_MM10 = false
        }


        if (this.MMA30 > this.MMA99) {
            l('red', ['MMA30 > MMA20 - - - -  A Tendência está em Alta' , this.MMA30, this.MMA99]);
            this.senderAnalizer.MMA30_UP_MMA99 = true;
        } else {    
            l('green', ['MMA30 < MMA20 - - - - A Tendências está em baixa', this.MMA30, this.MMA99]);
            this.senderAnalizer.MMA30_UP_MMA99 = false;
        }

        if(this.BuyVolume > this.SellVolume) {
            l('red', ['BuyVolume > SellVolume', this.BuyVolume, this.SellVolume]);
            this.buyVolumeUpSell = true;
        } else {
            l('green', ['BuyVolume < SellVolume', this.BuyVolume, this.SellVolume]);
            this.buyVolumeUpSell = false;
        }

        if (this.currentValor > mock) {
            l('magenta', ['Tendencia: ', 'Cima']);
        } else {
            l('magenta', ['Tendencia: ', 'Baixa']);
        }


        if (this.currentValor > this.suportMMA) {
            l('magenta', ['Suporte 30 : ', this.suportMMA]);
            this.senderAnalizer.valorUpMMA = true
        } else {
            l('magenta', ['Resistencia 30: ', 'Baixa']);
            this.senderAnalizer.valorUpMMA = false
        }

        if (this.MMA99 > this.MMA30) {
            l('magenta', ['MMA99 > MMA30', this.MMA99 > this.MMA30]);
            this.senderAnalizer.MMA99_UP_MMA30 = true;
        } else {
            l('magenta', ['MMA99 < MMA30', this.MMA99 < this.MMA30]);
            l('magenta', ['Fbuy: ', this.Fbuy]);
            this.Fbuy = false;
            this.senderAnalizer.MMA99_UP_MMA30 = false;
        }
 
       
        if (this.RSI > 60) {
            l('red' ,[this.RSI])
            this.senderAnalizer.rsiUp60 = true;
        } else {
            (this.RSI < 40) ? l('green', [this.RSI]) : l('yellow', [this.RSI])
            this.senderAnalizer.rsiDown60 = false;
        }

        await this.redis.set(`${this.symbol.toLowerCase()}_current_analizer_${this.time}`, JSON.stringify(this.senderAnalizer));
        }, 12000);
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async analyzerRangeTouchMMA() {
        // Criar um array que tera a informaçao da linha mma em um array bi dimensional
        // [{MMA10 :  values,MMA20 : values, time: } ]
        setInterval(() => {
            this.MMAARRAY.push({
                "MMA10" : this.MMA10,
                "MMA30" : this.MMA30,
                "Time" : new Date().getTime(),
                "CurrentValor" : this.currentValor
            })

            if(this.MMAARRAY >= 30) {
                this.MMAARRAY.shift();
            }

            const Distance = Math.round(this.MMA10) - Math.round(this.MMA30);

            if (Distance >= 70) {
                this.touchArrayMMA.push(1)
            } else {
                this.touchArrayMMA.push(0)
            }

            if (this.touchArrayMMA >= 30) {
                this.touchArrayMMA.shift();
            }
            
            this.redis.set(`${this.symbol}_${this.time}_tochArray`, JSON.stringify(this.touchArrayMMA))
            this.redis.set(`${this.symbol}_${this.time}_MMA`, JSON.stringify(this.MMAARRAY))

        }, convertObject(this.time))

    }

    async getFullAnalisys () {
        while (true) {
            const allProprieties = {
                time: this.CurrentTime,
                symbol: this.symbol,
                suporte: this.suporte,
                resistencia: this.resistencia,
                MMA: this.MMA,
                MMA10: this.MMA10,
                MMA30: this.MMA30,
                MMA99: this.MMA99,
                RSI: this.RSI,
                suportMMA: this.suportMMA,
                resistMMA: this.resistMMA,
                SellVolume: this.SellVolume,
                BuyVolume: this.BuyVolume,
                MMA30_UP_MM10: this.senderAnalizer.MMA30_UP_MM10,
                MMA30_UP_MMA99: this.senderAnalizer.MMA30_UP_MMA99,
                valorUpMMA: this.senderAnalizer.valorUpMMA,
                MMA99_UP_MMA30: this.senderAnalizer.MMA99_UP_MMA30,
                rsiUp60: this.senderAnalizer.rsiUp60,
                rsiDown60: this.senderAnalizer.rsiDown60,
                buyVolumeUpSell: this.buyVolumeUpSell,
                currentValor: this.currentValor,
            }

            await this.redis.set(`${this.symbol.toLowerCase()}_full_analizer_${this.time}`, JSON.stringify(allProprieties));
        
            await this.delay(5000);
        }
    }

    async initRedis () {
        this.redis = new Redis();
    }

    async getStrem() {
        const time = '1m'
        const Symbol  = (this.symbol).toLowerCase();
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/' + Symbol + '@kline_' + time);
          ws.on('message', async  (data) => {

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

                  let string = JSON.stringify(btc);
                  
                  await this.redis.set(`${Symbol.toLowerCase()}`, string);
                  const current = {
                        symbol: trade.s,
                        time: moment(trade.k.t).format('YYYY-MM-DD HH:mm:ss'),
                        close: roundToTwo(btc.close)
                  }
                  await this.redis.set(`${Symbol.toLowerCase()}_current`, JSON.stringify(current));
                  this.currentValor = roundToTwo(btc.close);
                }
          });
    }   
}


module.exports = Robot;

