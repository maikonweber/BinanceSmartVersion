const moment = require('moment');
let { getCandleStatistc } = require('./candles.js');
var tulind = require('tulind');;
let { getMMA } = require('./candles.js');
let { writeJson } = require('./writeJson.js');
const { ifHaveCoin } = require('./api.js');
const { checkHaveOrder } = require('./api.js');
const { cancallAllOpenOrder } = require('./api.js'); 
const { newOCO, newOrder } = require('./api.js');
const WebSocket = require('ws');
const { roundToTwo } = require('./candles.js');
const { allOrders } = require('./api.js');


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
        this.writeResult();
        // this.getResult();
        this.analictEntry();
        this.console_();
        
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
            if (this.havecurrency == false && this.suporte != 0) {
                console.log("Analisando Entranda")
                console.log('Atualizando valores de ', this.syngal);
                console.log('Current Valor', this.currentValor);
                console.log('Current RSI', this.currentRSI);
                console.log('Suporte', this.suporte);
                console.log('Have Currency', this.havecurrency);
                if (this.currentValor <= this.suporte && this.lastRSI < 45) {
                 this.getOrder();
                console.log("Em ordem de Compra");
                console.log('Current Valor', this.currentValor);
                } else {
                console.log("Não comprou porque não está no suporte");
                }
            } else if (this.havecurrency == true) {
            if (this.currentValor <= this.setStopLoss) {
                this.getOrderSell();
                    console.log("Em ordem de Venda - Stop Loss");
                    console.log('Current Valor', this.currentValor);
                } else if (this.currentValor >= this.currentTarget) {
                    this.getOrderSell();
                    console.log("Em ordem de Venda - Target");
                    console.log('Current Valor', this.currentValor);
            } else if (this.currentValor >= this.resistencia && this.lastRSI > 45) 
                {
                this.getOrderSell();   
                console.log('Em ordem de Venda - Maior que resistencia');  
            }  else {
                console.log("Não vendeu porque não está no Resistencia");
                console.log("Não tem moeda");
            }
        }

        }, 10000);
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

    async console_() {
        setInterval( async () => {
            this.quantity_ = roundToTwo(this.amount / this.currentValor);
            const stopLoss = roundToTwo(this.lastBuyPrice - (this.lastBuyPrice * 0.02));   
            this.setStopLoss = stopLoss;

            this.currentTarget = roundToTwo(this.lastBuyPrice + (this.lastBuyPrice * 0.007));
            
        }, 25000);
    

    }

    async setStopLoss() {
            setInterval( async () => {
           
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


    async getOrder() {
        console.log('Ordem ');
        let OCOper1 = this.suporte * 0.002;
        let OCOstopGain = roundToTwo(this.suporte - OCOper1);
        console.log(OCOstopGain);
        
        let OCOper2 = this.suporte * 0.0015;
        let OCOstopLoss = roundToTwo(this.suporte + OCOper2);
        console.log(OCOstopLoss);

        this.lastBuyPrice = this.currentValor;

        let buyOrder = {
            symbol: this.syngal,
            side: 'BUY',
            type: 'OCO',
            timeInForce: 'GTC',
            target: this.suporte,
            Buy : this.currentValor,
            stopPrice: OCOstopLoss,
            stopGain : OCOstopGain,
            Lucro : 'Ordem de Compra'
        }

        const result = await newOrder(buyOrder.symbol, this.quantity_ , 'BUY', 'LIMIT', buyOrder.Buy);
        console.log(result);

        this.resultofOrder.push(buyOrder);
        // this.haveorder = true;
        this.havecurrency = true;
   }

    async getOrderSell() {
        let OCOper1 = this.resistencia * 0.002;
        let OCOstopGain = roundToTwo(this.resistencia + OCOper1);
        console.log(OCOstopGain);
        
        let OCOper2 = this.resistencia * 0.0015;
        let OCOstopLoss = roundToTwo(this.resistencia - OCOper2);
        console.log(OCOstopLoss);

        let SellOrder = {
            symbol: this.syngal,
            side: 'SELL',
            type: 'OCO',
            timeInForce: 'GTC',
            quantity: this.amount / this.currentValor,
            target: this.suporte,
            Buy : this.currentValor,
            stopPrice: OCOstopLoss,
            stopGain : OCOstopGain,
            Lucro : this.currentValor - this.lastBuyPrice
        }

        const result = await newOrder(sellOrder.symbol, this.quantity_ , 'BUY', 'LIMIT', sellOrder.Buy);
        console.log(result);
        this.resultofOrder.push(SellOrder);
        // this.haveorder = false;
        this.havecurrency = false;
    }

    async writeResult() {
        setInterval(async () => {
            writeJson(this.resultofOrder, 'resultofOrder.json');
            writeJson(this.resultOfSellOder, 'resultOfSellOder.json');
            console.log("\x1b[33m",this.resultofOrder, "Resultado");
        
        }, 500000);      
    }

    async getResult() {
        setInterval(async () => {
            let result = this.resultTotal;
            console.log("\x1b[33m", result, "Resultado Total");
        }, 450000);
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
        // take the last order
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

    const app = new Robot(10, 'MATICBUSD', '1m', 30);
    app.Init();


 //    Defaults modules export  
    module.exports = {
        Robot: Robot
    }
