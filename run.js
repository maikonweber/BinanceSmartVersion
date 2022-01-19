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
        this.havecurrency = false
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
        this.bestBuyPrice = 0;

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

        this.resultTotal = 0
        this.resultOfSellOder = [];

        this.steamPrice = 0;
        this.currentTarget = 0;
        this.lastBuyPrice = 0;

    }

    async Init() {
        this.statist();
        this.getSuporte();
        this.getTendecia();    
        this.checkOrder(this.syngal);
        this.getStrem(); 
        this.cheackRSI();
        this.writeResult();
        this.getResult();
        this.analictEntry();
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
            console.log("Analisando Entranda")
            this.checkifYouHave(this.syngal); 
                if (this.havecurrency == false && this.suporte !=0) {
                    this.checkOrder(); 
                    if (this.haveorder == false) {
                       if (this.currentValor <= this.suporte && this.lastRSI < 45) {
                            this.getOrder();
                            console.log("Em ordem de Compra");
                        } else {
                            console.log("Não comprou porque não está no suporte");
                        }
                    } else {
                        console.log("Valor dentro da ordem de OCO");
                    }
                    } else if (this.havecurrency == true) {
                        this.checkOrder();
                        this.setStopLoss();
                        if (this.haveorder == false) {
                    if (this.currentValor >= this.resistencia && this.lastRSI > 45) {    
                        this.getOrderSell();   
                        console.log('Venda')                 
                    } else {
                        console.log("Não vendeu porque não está no Resistencia");
                    }
                } else {
                    console.log("Já tem uma ordem"); 
                } 
            } else {
                console.log("Não tem moeda");
            }

        }, 45000);
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
      
        setInterval( async () => {
            console.log("\x1b[33m",this.CurrentTime,"\x1b[33m" , "Ultimo Atualizado");
            console.log("\x1b[33m",this.suporte,"\x1b[31m" ,"Suporte");
            console.log("\x1b[33m", this.resistencia, "\x1b[32m","Resistencia");
            console.log("\x1b[33m",this.currentValor,"\x1b[35m" ,"Valor Atual");
            console.log("\x1b[33m",this.currentTarget,"\x1b[36m" ,"RSI Atual");
            console.log("\x1b[33m",this.lastRSI,"\x1b[36m" ,"Ultimo RSI");
            console.log("\x1b[33m",this.lastRSImedia,"\x1b[36m" ,"Ultimo RSI media");
            console.log("\x1b[33m",this.currentMediaRSI14,"\x1b[36m" ,"Media RSI 14");
            console.log("\x1b[33m",this.tendencia,"\x1b[36m" ,"Tendencia");
            console.log("\x1b[33m",this.havecurrency,"\x1b[36m" ,"Tem Moeda");
            console.log("\x1b[33m",this.haveorder,"\x1b[36m" ,"Tem Ordem");
            

            console.table(this.resultofOrder);
            console.table(this.resultOfSellOder);

           
        }, 15000);
    }   

    

    async setStopLoss() {
       if (this.havecurrency = true) {
        if (this.haveorder == false) {
            this.getAllOrder(this.syngal);
            const stopLoss = this.lastBuyPrice -  (this.lastBuyPrice * 0.05);             
              if (this.currentValor <= stopLoss) {
                    const stop = await newOrder(this.syngal, this.amount, 'SELL')
                    console.timeLog(stop)
                    console.log("Em ordem de Compra");
              } else {
                  console.log('Stop Loss não foi atingido')
              }
            }
       }
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
        console.log('Ordem');
        let OCOper1 = this.suporte * 0.002;
        let OCOstopGain = roundToTwo(this.suporte - OCOper1);
        console.log(OCOstopGain);
        
        let OCOper2 = this.suporte * 0.0015;
        let OCOstopLoss = roundToTwo(this.suporte + OCOper2);
        console.log(OCOstopLoss);

        let buyOrder = {
            symbol: this.syngal,
            side: 'BUY',
            type: 'OCO',
            timeInForce: 'GTC',
            quantity: this.amount,
            target: this.suporte,
            Buy : this.currentValor,
            stopPrice: OCOstopLoss,
            stopGain : OCOstopGain,
        }
        const buyorder = await newOCO(buyOrder.symbol, this.amount, buyOrder.stopGain, buyOrder.side, buyOrder.target, buyOrder.stopPrice);
        console.log(buyorder);

        this.resultOfSellOder.push(buyOrder);
        this.haveorder = true;
shh     }

    async getOrderSell() {
        let OCOper1 = this.resistencia * 0.002;
        let OCOstopGain = roundToTwo(this.resistencia + OCOper1);
        console.log(OCOstopGain);
        
        let OCOper2 = this.resistencia * 0.0015;
        let OCOstopLoss = rountToTwo(this.resistencia - OCOper2);
        console.log(OCOstopLoss);

        let SellOrder = {
            symbol: this.syngal,
            side: 'SELL',
            type: 'OCO',
            timeInForce: 'GTC',
            quantity: this.amount,
            target: this.suporte,
            Buy : this.currentValor,
            stopPrice: OCOstopLoss,
            stopGain : OCOstopGain,
        }

        const sellOrder = await newOCO(SellOrder.symbol, this.amount, SellOrder.stopGain, SellOrder.side, SellOrder.target, SellOrder.stopPrice);
        console.log(sellOrder);

        this.resultofOrder.push(SellOrder);
        this.haveorder = true;
    }

    async writeResult() {
        setInterval(async () => {
            writeJson(this.resultofOrder, 'result.json');
            console.log("\x1b[33m",this.resultofOrder, "Resultado");
        
            
        }, 3600000);      
    }

    async getResult() {
        setInterval(async () => {
            let result = this.resultTotal;
            console.log("\x1b[33m", result, "Resultado Total");
        }, 450000);
    }

    async checkifYouHave(symbol) {
        console.log('Verificando se possui a moeda');
         const result = await ifHaveCoin(symbol);
          // Separate the symbol by the string b
        let symbolArray = symbol.split('BUSD');
        const result1 = await ifHaveCoin(symbolArray[0]);
            if (result1.free > 0) {
                this.havecurrency = true;
            } else {
                this.havecurrency = false;
            }
    }

    async checkOrder(symbol) {
        console.log('Verificando se possui a ordem');
        const result = await checkHaveOrder(symbol);        
        console.log(result);
        if (result.length > 0) {
            this.haveorder = true;
        } else {
            this.haveorder = false;
        }
        console.log(this.haveorder, 'Check Order');
    }

    async cancelOrder(symbol) {
        const result = await cancallAllOpenOrder(symbol);
        console.log(result);
        
    }

    async getAllOrder(symbol) {
        const result = await allOrders(symbol);
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

const start = new Robot(15,'MATICBUSD', '5m', '30');
start.Init();


module.exports = Robot;