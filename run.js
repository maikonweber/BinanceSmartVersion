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



class Robot {
    constructor(amount, syngal, time, interval) {
        // Order information
        this.havecurrency = false;
        this.haveorder = false
        // params
        this.CurrentTime = null;
        this.amount = amount;
        this.syngal = syngal;
        this.time = time;
        this.interval = interval;
        // Suporte 
        this.suporte = 0;
        this.suporte5 = 0;
        this.suporte10 = 0;
        this.suporte100= 0;
        this.suporte500 = 0;
        this.suporte1000 = 0;
        this.suporte5000 = 0;
        this.resistencia = 0;
        this.resistencia5 = 0;
        this.resistencia10 = 0;
        this.resistencia100 = 0;
        this.resistencia500 = 0;
        this.resistencia1000 = 0;
        this.resistencia5000 = 0;
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
        this.statist();
        this.getSuporte();
        this.getTendecia();    
        this.getStrem(); 
        this.cheackRSI();   
        this.console__();
        this.setStopCurrentTarget();
        this.analictEntry();  
        this.cheackAmount();   
    }

    async statist() {
        console.log('statist');
        setInterval(async () => {
            let candle = await getCandleStatistc(this.syngal, this.time, this.interval);
            
            this.lastStactis = candle;
            console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
            this.CurrentTime = this.lastStactis.time;

            if (this.static.length > 99) {
                this.static.shift();
            }

            }, 10000);
}

    async console__() {
        
// Print all properties of the object
        setInterval(async () => {
            console.log(this.resistencia, "resistencia");
            console.log(this.suporte, "suporte");
            console.log(this.tendencia, "tendencia");
            console.log(this.currentValor, "currentValor");
            console.log(this.lastRSI, "lastRSI");
            console.log(this.lastRSImedia, "lastRSImedia");
            console.log(this.quantity_, "amount");
            console.log(this.setStopLoss, "setStopLoss");
            console.log(this.currentTarget, "currentTarget");

        }, 30000);
    }

    async getSuporte() {
        setInterval( async () => {
            console.log('Atualizando valores de ', this.syngal); 
            this.suporte10 = this.lastStactis.supAndRes10.Suporte;
            this.suporte20 = this.lastStactis.supAndRes20.Suporte;
            this.suporte50 = this.lastStactis.supAndRes50.Suporte;
            this.suporte100= this.lastStactis.supAndRes100.Suporte;
     
        
            if (this.time == '1m') {
            this.suporte = this.suporte10
            } else if (this.time == '5m') {
                this.suporte = this.suporte20
            } else if (this.time == '15m') {
                this.suporte = this.suporte50
            } else if (this.time == '30m') {
                this.suporte = this.suporte100
            } else {
                console.log('Erro ao atualizar Suporte')
            }


            this.resistencia10 = this.lastStactis.supAndRes10.Resistencia;
            this.resistencia20 = this.lastStactis.supAndRes20.Resistencia;            
            this.resistencia50= this.lastStactis.supAndRes50.Resistencia;
            this.resistencia100= this.lastStactis.supAndRes100.Resistencia;
   

            if (this.time == '1m') {
                console.log('Tempo definido 1m');
            this.resistencia = this.resistencia10
            } else if (this.time == '5m') {
                console.log('Tempo definido 5m');
                this.resistencia = this.resistencia20
            } else if (this.time == '15m') {
                console.log('Tempo definido 15m');
                this.resistencia = this.resistencia50
            } else if (this.time == '30m') {
                console.log('Tempo definido 30m');
                this.resistencia = this.resistencia100
            } else {
                console.log('Erro ao atualizar Resistencia')
            }

        

        }, 60000);
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
    async analictEntry() {       
        setInterval( async () => {
            if (this.havecurrency == false && this.haveorder == false) {
              this.analictBuy();
            } else if (this.havecurrency == true && this.haveorder == false) {
                this.analictSell();
            }

        }, 10000);
    }

    async analictSell() {
        console.log('Analisando Venda')
        if (this.currentValor >= this.resistencia && this.lastRSI > 45) {
            console.log('Venda Resistencia');
            this.sell();
           } else if (this.currentValor <= this.stopLoss) {
            console.log('Venda STOPLOSS');
            this.sell();
           } else if (this.currentRSI > 75) {
            console.log('Venda currentRSI > 75');
            this.sell();  
           }
    }

    async analictBuy() {
        console.log('Analisando Compra')
        if (this.currentValor <= this.suporte && this.lastRSI < 45)
        {
            console.log('Compra Suporte');
            this.buy();

        } else {
            console.log(`Não comprou pois o valor atual ${this.currentValor} é maior que o suporte`, this.suporte , 'e o RSI é', this.lastRSI);
        }
    }

    async checkOrder() {
        const order = await allOrders();
        console.log(order);
        if (order.length > 0) {
            this.haveorder = true;
        }
            else {
                this.haveorder = false;
            }
    }

    async cheackCurrency() {
        const letter = this.syngal
       // Count the string
        const count = (letter.match(/[a-z]/gi) || []).length;
     // Seach for BUSD in String and slice
        const search = letter.search('BUSD');
        const slice = letter.slice(search, count);
        const lol = await ifHaveCoin(slice);
        console.log(lol)
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

     const ret = Math.round(number);

     return ret;

    }

    async cheackAmount() {

        setInterval( async () => {
            this.quantity_ = this.roundtoOne(this.amount / this.currentValor);    
        }, 25000);
    }

    async setStopCurrentTarget() {
        // Round to three decimal places
        setInterval( async () => {
            if (this.lastBuyPrice != 0) {   
            this.stopLoss =  roundToTwo(this.lastBuyPrice - (this.lastBuyPrice * 0.0075));
            }

            if (this.lastBuyPrice != 0) {
            this.currentTarget = roundToTwo(this.lastBuyPrice + (this.lastBuyPrice * 0.01));    
            }
        }, 25000);
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
        const buyOrder = await newOrder(this.syngal, 'BUY', this.quantity_, 'MARKET', this.currentValor);
        if (buyOrder.msg == 'Order placed successfully') {
            this.havecurrency = true;
            this.lastBuyPrice = this.currentValor
            const insert = await insertOrder(this.syngal, 'BUY', this.currentValor, this.quantity_ , 'MARKET');
            console.log(insert);
        }

    }

    async sell() {
        const sellOrder = await newOrder(this.syngal, 'SELL', this.quantity_, 'MARKET', this.currentValor);
        if (sellOrder.msg == 'Order placed successfully') {
            this.havecurrency = false;
            const insert = await insertOrder(this.syngal, 'SELL', this.currentValor, this.quantity_ , 'MARKET');
            console.log(insert);
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

    async checkOrder(symbol) {
        console.log('Verificando se possui a ordem');
        const result = await checkHaveOrder(symbol);   
        console.log(result)    
        if (result.length > 0) {
            this.haveorder = 'true';
            console.log('Tem ordem', this.haveorder);
        } else {
            this.haveorder = false;
            console.log('Tem ordem', this.haveorder);
        }
        console.log(this.haveorder, 'Check Order');
    }

    async cancelOrder(symbol) {
        const result = await cancallAllOpenOrder(symbol);
        console.log(result);
        
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
