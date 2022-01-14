const moment = require('moment');
let { getCandleStatistc } = require('./candles.js');
var tulind = require('tulind');;
let { getMMA } = require('./candles.js');
let { writeJson } = require('./writeJson.js');

class Robot {
    constructor(amout, stopLoss, takeProfit, syngal, time, interval, saldoInicial) {
        // Order information
        this.havecurrency = false
        this.haveorder = false
        // params
        this.CurrentTime = null;

        this.amount = amout;

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


        this.currentTarget = 0;


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
        console.log(this.suporte , "Suporte");
        setInterval( async () => {
            console.log("Analisando Entranda")

                if (this.havecurrency == false && this.suporte !=0) {
                    console.log('Não tem moeda');
                    if (this.currentValor <= this.suporte && this.lastRSI < 45) {
                        this.getOrder();
                        console.log("Compra")
                    } else {
                        console.log("Não comprou porque não está no suporte");
                    }
                 } else if (this.havecurrency == true) {
                    console.log("Tem a Moeda")
                    this.getStopGain();
                    this.setStopLoss();
                    if (this.currentValor >= this.resistencia && this.lastRSI > 45 || this.lastRSI > 60) {    
                        this.getOrderSell();   
                        console.log('Venda')                 
                    } else {
                        console.log("Não vendeu porque não está no Resistencia");
                    }
                } else {
                    console.log("Existe divergencia em Ordem Ativas")
                }

        }, 35000);
    }

    async getStrem() {
        console.log('Stream');
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
        if(this.havecurrency == true ) {
            console.log("Verificando o Stop Loss")            // take the last object o refult of order
            let lastOrder = this.resultofOrder[this.resultofOrder.length - 1];
            console.log("\x1b[33m",lastOrder,"\x1b[33m" ,"Ultimo Objeto");
            let lastOrderPrice = lastOrder.Buy
            let porcent = 0.0052;
            let lastOrderPercent = lastOrderPrice * porcent;
            let stopLoss = lastOrderPrice - lastOrderPercent;
            console.log("Stop Loss", stopLoss);
        
            if (this.currentValor <= stopLoss) {
                this.getOrderSell();
            } else {
                console.log("Não está em stoploss");
            }
        }
    }

    async getStopGain() {
        if (this.havecurrency = true) {
             // take the last object o refult of order
             console.log("Verificando o Stop Gain")
             let lastOrder = this.resultofOrder[this.resultofOrder.length - 1];
             let lastOrderPrice = lastOrder.Buy
             let porcent = 0.0042;
             let lastOrderPercent = lastOrderPrice * porcent;
             let stopGain = lastOrderPrice + lastOrderPercent;
                console.log("Stop Gain", stopGain);
            if (this.currentValor >= stopGain) {
                this.getOrderSell();
                
            } else {
                 console.log('Não está no StopGain');
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
        
}, 35000);
}

    async getOrder() {
        console.log(this.currentTarget, "Target");
        console.log("Compra");
        console.log('Order Buy');
        let buyOrder = {
            pair: this.syngal,
            type: "buy",
            amount: this.amount,
            Buy: this.currentValor,
            stop: this.currentTarget,
            orderExec: "market",
            stop: this.currentTarget,
            time: this.CurrentTime
            }
        
        this.resultofOrder.push(buyOrder);
        this.haveorder = true;
        this.havecurrency = true;
    }

    async getOrderSell() {
        let OCOper1 = this.resistencia * 0.0049;
        let OCOstopGain = this.resistencia + OCOper1;

        let OCOper2 = this.resistencia * 0.0030;
        let OCOstopLoss = this.resistencia - OCOper2;

        let sellOrder = {
            pair: this.syngal,
            type: "sell",
            amount: this.amount,
            price: this.currentValor,
            stop: this.resistencia,
            OCOgain : OCOstopGain,
            OCOloss : OCOstopLoss,
            orderExec : "market",
            time : this.CurrentTime
        }

        this.resultOfSellOder.push(sellOrder);
        this.haveorder = false;
        this.havecurrency = false;
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


module.exports = Robot;