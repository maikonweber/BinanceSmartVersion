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



class Robot {
    constructor(amount, syngal, time, interval) {
        // Order information
        this.havecurrency = false;
        this.haveorder = false
        this.orderId = null;
        // params
        this.CurrentTime = null;
        this.amount = amount;
        this.syngal = syngal;
        this.time = time;
        this.interval = interval;
        this.currentSuport = 0;
        this.currentResistencia = 0;
        this.suporte = 0;
        this.suporte5 = 0;
        this.suporte10 = 0;
        this.suporte100= 0;
        this.resistencia = 0;
        this.resistencia5 = 0;
        this.resistencia10 = 0;
        this.resistencia100 = 0;
        // Resistencia
        this.resistencia = 0;
        // Melhor preço de compra 
        this.bestBuyPrice = roundToTwo(this.suporte - (this.suporte * 0.03));
        // Statisticas no periodo de  99
        this.static = [];
        // Ultimo Statisticas
        this.lastStactis = {};
        this.currentValor = 0;
        // Tendencia
        this.tendencia = null;
        // Atual RSI
        this.currentRSI = 0;
        // Relação entre deph e Suporte
        this.deph2Sup = 0;
        this.operationPeriodo = 24;
        // Array com ultimos 14 valores de RSI
        this.mediaRSI = [];
        this.lastRSImedia = 0;
        this.currentMediaRSI14 = 0;
        this.lastRSI = 0;

        this.resultofOrder = [];
        this.setStopLoss = 0;
        this.steamPrice = 0;
        this.currentTarget = 0;
        this.lastBuyPrice = 0;
        this.quantity_  = 0;
    }

    async Init() {

        Promise.all([this.statist(), this.getSuporte(), this.console__()]).then(() => {
                console.log('Todas as Promises foram resolvidas');
            }).catch(err => {
                console.log('Erro ao resolver as Promises');
            }).finally(() => {
                console.log('Fim do programa');
            });
    

        // this.statist();
        //  this.checkOrder();
        //  this.cheackCurrency();
        //  this.getSuporte();
        //  this.getTendecia();    
        //  this.getStrem(); 
        //  this.cheackRSI();   
        //  this.console__();
        // this.setStopCurrentTarget();
        // // this.analictEntry();  
        // this.cheackAmount();  
        // this.giveUp();   
    }

    async statist() {
        console.log('statist');
        while (true) {
            let candle = await getCandleStatistc(this.syngal, this.time, this.interval);
            this.lastStactis = candle;
            console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
            this.CurrentTime = this.lastStactis.time;
            if (this.static.length > 99) {
                this.static.shift();
            }
            await this.sleep(35000);    
        }
}

    async console__() {
        
// Print all propertiesm,,,,,,,,,,,,,,,,,,,,,,, of the object
       while (true) {
            console.log(this.resistencia, "resistencia");
            console.log(this.suporte, "suporte");
            console.log(this.currentSuport, "currentSuport");
            console.log(this.currentResistencia, "currentResistencia");

        await this.sleep(35000);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async checkOrder() { 
        while (true) {
        const order = await checkHaveOrder(this.syngal);
            if (order.length > 0) {
                this.haveorder = true;
                this.orderId = order[0].id;
                console.log('Tem ordem ativa');
            } else {
                this.haveorder = false;
                console.log('Não tem ordem ativa');
            }
            await this.sleep(45000);
        }
    }

    async cheackCurrency() {
        while (true) {
            const currency = await ifHaveCoin(this.syngal);
            if (currency.length > 0) {
                this.havecurrency = true;
                console.log('Tem moeda');
            } else {
                this.havecurrency = false;
                console.log('Não tem moeda');
            }
        await this.sleep(45000);
        } 
    }

    async getSuporte() {
            while (true) {
                const candle = await getCandleStatistc(this.syngal, this.time, this.interval);
                this.lastStactis = candle;
                this.CurrentTime = this.lastStactis.time;
                console.log(this.lastStactis)
                console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
                console.log(this.lastStactis.time, "time");
                console.log(this.lastStactis.close, "close");
                console.log(this.lastStactis.high, "high");
                
                deph(time)()

                const deph = {
                    '1m' : () => {
                        this.currentResistencia = this.lastStactis.supAndRes10.Resistencia;
                        this.currentSuport = this.lastStactis.supAndRes10.Suporte;
                    },
                    '5m' : () => {
                        this.currentResistencia = this.lastStactis.supAndRes5.Resistencia;
                        this.currentSuport = this.lastStactis.supAndRes5.Suporte;

                    },
                    '15m' : () => {
                        this.currentResistencia = this.lastStactis.supAndRes20.Resistencia;
                        this.currentSuport = this.lastStactis.supAndRes20.Suporte;
                    },
                    '30m' : () => {
                        this.currentResistencia = this.lastStactis.supAndRes50.Resistencia;
                        this.currentSuport = this.lastStactis.supAndRes50.Suporte;
                    },
                    '1h' : () => {
                        this.currentResistencia = this.lastStactis.supAndRes100.Resistencia;
                        this.currentSuport = this.lastStactis.supAndRes100.Suporte;
                    }
                }

                
                this.suporte = this.lastStactis.supAndRes10.Suporte;
                this.resistencia = this.lastStactis.supAndRes10.Resistencia;

                this.suporte5 = this.lastStactis.supAndRes20.Suporte;
                this.resistencia5 = this.lastStactis.supAndRes20.Resistencia;

                this.suporte10 = this.lastStactis.supAndRes50.Suporte;
                this.resistencia10 = this.lastStactis.supAndRes50.Resistencia;

                this.suporte100 = this.lastStactis.supAndRes100.Suporte;
                this.resistencia100 = this.lastStactis.supAndRes100.Resistencia;

                await this.sleep(45000);
            }
    }

    async getTendecia() {
        setInterval( async () => {
        if (this.lastStactis.MMA10 > this.lastStactis.MMA30) {
            this.tendencia = true;     
        }
        else {
            this.tendencia = false;
        }
        }, 30000);
}


    async getStrem() {
        const time = '1m'
        const Symbol  = (this.syngal).toLowerCase();
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

    roundtoOne(number) {
        // Rount to two decimal places
        return Math.round(number * 10) / 10;
    }

    async cheackAmount() {

        setInterval( async () => {
            this.quantity_ = this.roundtoOne(this.amount / this.currentValor);    
        }, 60000);
    }

    async setStopCurrentTarget() {
        // Round to three decimal places
        setInterval( async () => {
            if (this.lastBuyPrice != 0) {   
            this.stopLoss = roundToTwo(this.lastBuyPrice - (this.lastBuyPrice * 0.0075)); 
            }

            if (this.lastBuyPrice != 0) {
            this.currentTarget = roundToTwo(this.lastBuyPrice + (this.lastBuyPrice * 0.01));    
            }

        }, 60000);
    }
 
    async cheackRSI() {
        console.log('RSI');
        setInterval( async () => {
            this.lastRSI = roundToTwo(this.lastStactis.RSI);
            
            const rst = {
                RSI: this.lastStactis.RSI,
                time: this.lastStactis.time
            }

            this.mediaRSI.push(rst); 

            let media = 0;
            if (this.mediaRSI.length > 14) {
                this.mediaRSI.forEach(( element, i)=> {
                    if (i < 14) {
                        media += element.RSI;
                    }
                });
                this.currentMediaRSI14 = roundToTwo(media / 14);
        }
        
}, 35000);
}

    async buy() {
        console.log('Comprando ' + this.quantity_ + ' ' + this.syngal);
        try {
        const buyOrder = await newOrder(this.syngal, this.quantity_, 'BUY', 'LIMIT',  this.currentValor);
        this.haveorder = true;
        this.lastBuyPrice = this.currentValor;
        const send = await sendTelegram(`Comprando ${this.quantity_} ${this.syngal} ${this.currentValor}` );
        } catch (err) {

        }
    }

    async sell() {
        console.log('Vendendo ' + this.quantity_ + ' ' + this.syngal);
        try {
        //const sellOrder = await newOrder(this.syngal, this.quantity_, 'SELL', 'LIMIT',  this.currentValor);
        this.haveorder = true;
        const send = await sendTelegram(`VENDENDO = ${this.quantity_} ${this.syngal} ${this.currentValor}` );
        const send2 = await sendTelegram (`Lucro' + ${(this.currentValor - this.lastBuyPrice) * this.quantity_}`);
        try {
        // const insert = await insertOrder(this.syngal, 'SELL', this.currentValor, this.quantity_ , 'LIMIT');
        
        } catch (err) {
            console.log(err);
            const sent8 = await sendTelegram('Erro na inserção de ordem de venda no Banco');
        }
    } catch (err){
        console.log(err);
        const sent8 = await sendTelegram('Erro na execução ordem de venda no Banco');
        }
    }

 
    async checkifYouHave(symbol) {
        console.log('Verificando se possui a moeda');
         let result = await ifHaveCoin(symbol);
                console.log(result);
            if (result[0].free > 9) {
                this.havecurrency = result[0].asset;
                console.log('Tem moeda', result[0].asset, this.havecurrency);
            } else {
                this.havecurrency = result[0].asset;
                console.log('Tem moeda', result[0].asset, this.havecurrency);
            }

    }

    async checkOrderActive(symbol) {
        setInterval( async () => {
        const send2 = sendTelegram('Verificando se possui a ordem');
        //const result = await checkHaveOrder(this.syngal);   
        }, 60000);
    }


    async cancelOrder(symbol) {
      //  const result = await cancallAllOpenOrder(this.sygnal);
        //console.log(result);
        
    }

    async checkLastBuyPrice() {
        setInterval( async () => {
            console.log(this.lastBuyPrice);
        }, 60000);
    }

    async getAllOrder(symbol) {
        const result = await allOrders(this.symbol);
        const lastOrder = result[result.length - 1];
        const take = result.filter(element => element.status != 'CANCELED' && element.side == 'BUY');
        const lastTake = take[take.length - 1];
        this.lastBuyPrice = lastTake.price;
        console.log(this.lastBuyPrice);        
    }

    async checkApprox(num1, num2, epsilon) {
        return Math.abs(num1 - num2) <= epsilon;
    }
}

  

 //    Defaults modules export  
module.exports = {
    Robot
}
