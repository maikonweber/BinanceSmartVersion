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
        this.checkOrderActive();
        this.checkOrder();
        this.cheackCurrency();
        this.getSuporte();
        this.getTendecia();    
        this.getStrem(); 
        this.cheackRSI();   
        // this.console__();
        this.setStopCurrentTarget();
        // this.analictEntry();  
        this.cheackAmount();  
        this.giveUp();   
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

            }, 60000);
}

    async console__() {
        
// Print all properties of the object
        setInterval(async () => {
            console.log(this.resistencia, "resistencia");
            console.log(this.suporte, "suporte");
            console.log(this.currentValor, "currentValor");
           const send = await sendTelegram(`${this.syngal} - ${this.currentValor}`) 
           const send2 = await sendTelegram(`Analisando a Entrada de ${this.syngal}`)

        }, 60000);
    }

    async getSuporte() {
        setInterval( async () => {
            console.log('Atualizando valores de ', this.syngal); 
            this.suporte10 = this.lastStactis.supAndRes10.Suporte;
            this.suporte20 = this.lastStactis.supAndRes20.Suporte;
            this.suporte50 = this.lastStactis.supAndRes50.Suporte;
            this.suporte100= this.lastStactis.supAndRes100.Suporte;
     
        
            if (this.time == '1m') {
            this.suporte = this.suporte10 + (this.suporte10 + this.suporte10 * 0.00007);
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

        

        }, 100000);
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
            const send2 = await sendTelegram(`Analisando a Entrada de ${this.syngal}`)
            const send3 = await sendTelegram(`Analizando entrada', ${this.CurrentTime}`);
            console.log(`Analisando a Entrada de ${this.syngal}`);
            console.log(`Valor atual: ${this.currentValor}`);
            const send4 = await sendTelegram(`Analizando entrada, ${this.currentValor}, ${this.syngal}, ${this.CurrentTime}, ${this.resistencia}, ${this.suporte}, ${this.tendencia}`);
            console.log(`Valor de Suporte: ${this.suporte}`);
            console.log(`Valor de Resistencia: ${this.resistencia}`);
            if (this.havecurrency == false) {
                console.log('Não tem moeda');
                this.analictBuy();
            } else {
                console.log('Tem moeda');
                console.log(this.setStopLoss, "setStopLoss");
                this.analictSell();
            }
    }

    async analictSell() {
        const send1 = await sendTelegram('Analisando Venda')
        const send2 = await sendTelegram(`Valor atual: ', ${this.currentValor}, 'Valor de Compra:', ${this.lastBuyPrice}`  );
        if (this.currentValor >= this.resistencia && this.lastRSI > 45) {
            this.cancelOrder();
            const send3 = await sendTelegram('Venda Resistencia');
            this.sell();
           } else if (this.currentValor <= this.setStopLoss && this.lastRSI < 45) {
            this.cancelOrder();
            const send3 = await sendTelegram('Venda Stop Loss' + `${this.currentValor}`);
            console.log(this.setStopLoss, "stopLoss");
            this.sell();
           } else if (this.currentRSI > 78) {
            const send4 = await sendTelegram(`Venda RSI: ${this.currentValor}`);
            console.log('Venda currentRSI > 78');
            this.cancelOrder();
            this.sell();  
           } else {
            console.log('Não vendendou pois não atingiu condição');
            console.log(`Valor atual: ${this.currentValor}, Não atingiu condição`);
           }
    }

    async analictBuy() {
        console.log('Analisando Compra')
        if (this.currentValor <= this.suporte && this.lastRSI < 45)
        {
            const send1 = await sendTelegram(`Compra Suporte: ${this.currentValor}`);
            console.log('Compra Suporte');
            this.cancelOrder();
            this.buy();
        } else {
            const send2 = await sendTelegram(`Nao Comprou post valor atual: ${this.currentValor} ${this.suporte}`);	
            console.log(`Não comprou pois o valor atual ${this.currentValor} é maior que o suporte`, this.suporte , 'e o RSI é', this.lastRSI);
        }
    }

    async giveUp() {
        setInterval(async () => {
        console.log('Desistindo da compra');
    if (this.haveorder == true) {
        if (this.currentValor >= (this.suporte + (this.suporte * 0.09))) {
            this.cancelOrder(); 
            const send1 =  await sendTelegram(`Desistiu da compra, valor atual: ${this.currentValor}`);
        } else { 
            console.log("Não desistiu pois o valor atual é menor que o suporte");
            const send2 = await sendTelegram(`Não desistiu pois o valor atual é menor que o suporte: ${this.currentValor}`);
        }
    } else if (this.haveorder == true && this.havecurrency == true ) { 
            if (this.currentValor <= (this.resistencia + (this.resistencia * 0.09))) {
                console.log(`Desistiu desta Ordem de venda. Valor Atual', ${this.currentValor} Menor que variaçao de resistencia: ${(this.resistencia + (this.resistencia * 0.09))}`);
                this.cancelOrder();
            }
        }
    else {
        const send3 = await sendTelegram(`Não desistiu pois não tem ordem de compra`);
     
    }

}, 80000);
   
}

    async checkOrder() {
        setInterval( async () => {
        if (this.haveorder == false) {
            console.log('Não há ordem');
            this.analictEntry();

        } else {
            console.log('Já tem ordem em andamento');
            console.log(this.setStopLoss , "setStopLoss"); 
            if (this.currentValor <= this.stopLoss) {
                console.log('Venda STOPLOSS');
                const send2 = await sendTelegram(`Venda STOPLOSS: ${this.currentValor}`);
                this.cancelOrder();
                this.sell();
               }
        }

    }, 35000);

    }

    async cheackCurrency() {
        setInterval( async () => {
        const currency = await ifHaveCoin(this.syngal);
        const send1 = await sendTelegram(`Verificando se tem moeda: ${currency}`);
        if (currency[0].free > 2) {
            this.havecurrency = true;
        } else {
            this.havecurrency = false;
        }

    }, 60000);
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
        const sellOrder = await newOrder(this.syngal, this.quantity_, 'SELL', 'LIMIT',  this.currentValor);
        this.haveorder = true;
        const send = await sendTelegram(`VENDENDO = ${this.quantity_} ${this.syngal} ${this.currentValor}` );
        const send2 = await sendTelegram (`Lucro' + ${(this.currentValor - this.lastBuyPrice) * this.quantity_}`);
        try {
        const insert = await insertOrder(this.syngal, 'SELL', this.currentValor, this.quantity_ , 'LIMIT');
        
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
        const result = await checkHaveOrder(this.syngal);   
        console.log(result)    
        if (result.length > 0) {
            this.haveorder = 'true';
            const send2 = sendTelegram('Possui Ordem Ativa');
            this.orderId = result.orderId
        } else {
            this.haveorder = false;
            console.log('Tem ordem', this.haveorder);
            const send3 = sendTelegram('Nao Possui Ordem Ativa');
        }
        console.log(this.haveorder, 'Check Order');
        }, 60000);
    }


    async cancelOrder(symbol) {
        const result = await cancallAllOpenOrder(this.sygnal);
        console.log(result);
        
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
