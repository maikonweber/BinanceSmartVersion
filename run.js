const moment = require('moment');
let { getCandleStatistc } = require('./candles.js');
var tulind = require('tulind');;
let { getMMA } = require('./candles.js');
let { writeJson } = require('./writeJson.js');

class Robot {
    constructor(saldo, stopLoss, takeProfit, syngal, time, interval, saldoInicial) {
        // Order information
        this.havecurrency = false
        this.haveorder = false
        // params
        this.resistenciaMin  = 0
        this.CurrentTime = null;
        this.saldo = saldo;
        this.stopLoss = stopLoss;
        this.takeProfit = takeProfit;
        this.syngal = syngal;
        this.time = time;
        this.interval = interval;
        // Suporte 
        this.suporte = 0;
   
        this.suporte5 = 0;
        this.suporte10 = 0;
        this.suporte100= 0;
        this.suporte500 = 0;
        this.resistencia = 0;
        this.resistencia5 = 0;
        this.resistencia10 = 0;
        this.resistencia100 = 0;
        this.resistencia500 = 0;
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
        this.currentTarget = 0;
        this.operationPeriodo = 24;
        // Array com ultimos 14 valores de RSI
        this.mediaRSI = [];
        this.lastRSImedia = 0;
        this.currentMediaRSI14 = 0;
        this.lastRSI = 0;
        this.resultofOrder = [];	
        this.resultTotal = 0
        this.resultOfSellOder = [];


    }

    async Init() {
        this.statist();
        this.getSuporte();
        this.getTendecia();     
        
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
            this.currentValor = candle.close;
            console.log("\x1b[31m",'Atualizando valores de ', this.syngal);
            this.CurrentTime = this.lastStactis.time;

            if (this.static.length > 99) {
                this.static.shift();
            }

            }, 8000);
}

    async getSuporte() {
        setInterval( async () => {
            console.log('Atualizando valores de ', this.syngal); 
            this.suporte1 = this.lastStactis.supAndRes5.Suporte;
            this.suporte10= this.lastStactis.supAndRes10.Suporte;
            this.suporte100 = this.lastStactis.supAndRes100.Suporte;
            this.suporte500 = this.lastStactis.supAndRes500.Suporte;
            this.suporte = this.suporte1

            console.log("Suporte Atualizados");

            
            this.resistencia1= this.lastStactis.supAndRes5.Resistencia;
            this.resistencia5= this.lastStactis.supAndRes10.Resistencia;
            this.resistencia10= this.lastStactis.supAndRes100.Resistencia;
            this.resistencia500 = this.lastStactis.supAndRes500.Resistencia;
            this.resistencia = this.resistencia1

            console.log("Resistencia Atualizados");


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
        console.log(this.suporte , "Suporte");
       setInterval( async () => {

        }, 15000);
    }

    async getStrem() {
        console.log('Stream');
        setInterval( async () => {
            console.log("\x1b[33m",this.CurrentTime,"\x1b[33m" , "Ultimo Atualizado");
            console.log("\x1b[33m",this.suporte,"\x1b[31m" ,"Suporte");
            console.log("\x1b[33m", this.resistencia, "\x1b[32m","Resistencia");
            console.log("\x1b[33m",this.currentValor,"\x1b[35m" ,"Valor Atual");
            console.log("\x1b[33m",this.currentMediaRSI14, "\x1b[34m","Media RSI");
            console.log("\x1b[33m",this.lastRSI, "\x1b[34m","Ultimo RSI");
            console.log("\x1b[33m",this.resistencia5, "\x1b[34m","Resistencia");
            console.log(this.resultofOrder);
            

           
        }, 7000);
    }

    async setStopLoss() {
        if(this.havecurrency == true) {
            let lastOrder = this.resultofOrder[this.resultofOrder.length - 1];
            let lastOrderPrice = lastOrder.Buy
            let porcent = 0.0049;
            let lastOrderPercent = lastOrderPrice * porcent;
            let stopLoss = lastOrderPrice - lastOrderPercent;
        
            if (this.currentValor < stopLoss) {
                this.getOrderSell();
                this.havecurrency = false;
            } else {
                console.log("O valor não esta no resistencia, e não está em stoploss");
            }
        }
    }

    async getStopGain() {
        if (this.havecurrency = true) {
             // take the last object o refult of order
             let lastOrder = this.resultofOrder[this.resultofOrder.length - 1];
             let lastOrderPrice = lastOrder.Buy
             let porcent = 0.0030;
             let lastOrderPercent = lastOrderPrice * porcent;
             let stopLoss = lastOrderPrice + lastOrderPercent;
            if (this.currentValor >= stopLoss) {
                this.getOrderSell();
                this.havecurrency = false;
            } else {
                console.log('O valor não esta no resistencia, e não está em stopgain');
            }
        }
}

    async cheackRSI() {
        console.log('RSI');
        setInterval( async () => {
            this.lastRSI = this.lastStactis.RSI;
            
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
                this.currentMediaRSI14 = media / 14;
        }
        
}, 60000);
}

    async getOrder() {
        console.log('Comprando o valor', this.currentValor);
        this.resultofOrder.push({
            Buy : this.currentValor,
            RSI : this.currentRSI,
            suporte : this.resistencia,
            resistencia : this.resistencia
            });
        }

    async getOrderSell() {
        console.log('Vendendo', this.currentValor);
        let lastOrder = this.resultofOrder[this.resultofOrder.length - 1];
        let lastOrderPrice =  this.currentValor - lastOrder.Buy;
        this.resultTotal += lastOrderPrice;

        this.resultofSellOrder.push({
            Buy: lastOrder.Buy,
            Sell : this.currentValor,
            RSI : this.currentRSI,
            resistencia : this.suporte,
            suporte : this.suporte,
            result: lastOrderPrice
            });
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

    async checkApprox(num1, num2, epsilon) {
        return Math.abs(num1 - num2) <= epsilon;
    }
}

const start = new Robot(100, 20, 100, 'BNBBUSD', '1m', '30', 100);
start.Init();

