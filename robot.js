const { getCandleStatistc }
console.log(getCandleStatistc('BTCBUSD', '5m', '30'));
// Create a Object Robot with 3 methodo 
 class Robot {
    constructor(saldo, stopLoss, takeProfit, syngal, time, interval, saldoInicial) {
        this.saldo = saldo;
        this.stopLoss = stopLoss;
        this.takeProfit = takeProfit;
        this.syngal = syngal;
        this.time = time;
        this.interval = interval;
        let suporte = 0;
         let resistencia = 0;
         let bestBuyPrice = 0;

    }

    async Init() {
        this.statist();

    }

    async statist() {
        console.log('statist');
        const stact = await getCandleStatistc('BTCBUSD', '5m', '30');
        console.log(stact); 
    }  
        
}

