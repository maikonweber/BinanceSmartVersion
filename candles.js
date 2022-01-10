const api = require('./api');
const moment = require('moment');//
const tulind = require('tulind');




// Get max and min of the candles

async function getMaxMin(sygnal = 'BTCBUSD', time = '1h', interval = 30) {
      const candles = await formatBinaceDates(sygnal, time, interval);
      
      // For Each Candles
      const min1CandlesProperties = Object.keys(candles);
      const min1Candles = min1CandlesProperties.map(candle => {
         return candles[candle].close;
      }
      );

      // Get Max and Min
      const max = Math.max(...min1Candles);
      const min = Math.min(...min1Candles);


      return {max, min};

}  


async function getCandleStatistc(sygnal= 'BTCBUSD', time = '1h', interval = 30) {
   const min1Candles = await formatBinaceDates(sygnal, time, interval)
    const las = Object.keys(min1Candles);
    const key = (las[las.length - 1])
      min1Candles[key].RSI = roundToTwo(await getRSI(sygnal, time, interval));
      min1Candles[key].MMA3 = roundToTwo(await getMMA(sygnal, time, 3));
      min1Candles[key].MMA10 = roundToTwo(await getMMA(sygnal, time, 10));
      min1Candles[key].MMA30 = roundToTwo(await getMMA(sygnal, time, 30));
      min1Candles[key].MMA99 = roundToTwo(await getMMA(sygnal, time, 99, 99));
      min1Candles[key].maxMin1m = await getMaxMin(sygnal, '1m', 30);
      min1Candles[key].maxMin5m = await getMaxMin(sygnal, '5m', 30);
      min1Candles[key].maxMin15m = await getMaxMin(sygnal, '15m', 30);
      min1Candles[key].currentTime = moment(time.serverTime).format('YYYY-MM-DD HH:mm:ss');
      min1Candles[key].supAndRes5 = await GetSupAndRes(sygnal, '10');
      min1Candles[key].supAndRes10 = await GetSupAndRes(sygnal, '50');
      min1Candles[key].supAndRes100 = await GetSupAndRes(sygnal, '100');
      min1Candles[key].supAndRes500 = await GetSupAndRes(sygnal, '500');
   
     
                  
    return min1Candles[key];
}   

async function getRSI(sygnal = sygnal, time ='1h', inteval = 30) { 
   const min99Candles = await formatBinaceDates(sygnal, time, inteval)
   const lasted = []
   const allStats99 = await callIndicators(min99Candles);
   tulind.indicators.rsi.indicator([allStats99.AllClosePrice], [14], (err, results) => {
           if (err) {
              console.log(err);
           }
           var last = results[0][results[0].length - 1];
           lasted.push(last);
  });

   return lasted
 
}

async function getMMA(sygnal = sygnal, time = '1h', inteval = 30, media = 3) { 
   const min99Candles = await formatBinaceDates(sygnal, time, inteval)
   const lasted = []
   const allStats99 = await callIndicators(min99Candles);
   // Mma

   tulind.indicators.ema.indicator([allStats99.AllClosePrice], [media], (err, results) => {
           if (err) {
              console.log(err);
           }
           var last = results[0][results[0].length - 1];
           lasted.push(last);
  });

   return lasted
 
}

async function callIndicators(candlesData) {
   const AllOpenPrice = [];
   const AllClosePrice = [];
   const AllHighPrice = [];
   const AllLowPrice = [];
   const Volume = [];
   const min1CandlesProperties = Object.keys(candlesData);
   min1CandlesProperties.forEach( async (candle, i) => {
         AllOpenPrice.push(candlesData[i].open);
         AllClosePrice.push(candlesData[i].close);
         AllHighPrice.push(candlesData[i].high);
         AllLowPrice.push(candlesData[i].low);
         Volume.push(candlesData[i].volume);
   });

   return {AllClosePrice, AllOpenPrice, AllHighPrice, AllLowPrice};
}  

function roundToTwo(num) {    
   return +(Math.round(num + "e+2")  + "e-2");
}
async function formatBinaceDates(sygnal = 'BTCBUSC', time ='1h', inteval = 30) {
    
   const kline15m = await api.kline(sygnal, time, inteval);
   const candles15mObject = {};
   const candles15mArray = [];
   const candlesAndindicators15m = {};
   const open15m = [];
   const close15m = [];
   const high15m = [];
   const low15m = [];
   const volume15m = [];

   kline15m.forEach((kline, i) => {
       const time = moment(kline[0]).format('YYYY-MM-DD HH:mm:ss');
       const open = kline[1];
       const high = kline[2];
       const low = kline[3];
       const close = kline[4];
       const volume = kline[5];
       const closeTime = kline[6];
       const quoteAssetVolume = kline[7];
       const trades = kline[8];
       const takerBuyBaseAssetVolume = kline[9];
       const takerBuyQuoteAssetVolume = kline[10];

  

       open15m.push(open);
       close15m.push(close);
       high15m.push(high);
       low15m.push(low);
       volume15m.push(volume);


       candles15mObject[time] = {
           time,
           open,
           high,
           low,
           close,
           volume,
           closeTime,
           quoteAssetVolume,
           trades,
           takerBuyBaseAssetVolume,
           takerBuyQuoteAssetVolume
         
       };

       candles15mArray.push(candles15mObject[time]); 
   });
   candles15mArray.forEach( async (candle, i)  => {
      candlesAndindicators15m[i] = {
          
           time: candle.time,
           open: roundToTwo(candle.open),
           high: roundToTwo(candle.high),
           low: roundToTwo(candle.low),
           close: roundToTwo(candle.close),
           volume: roundToTwo(candle.volume),
           QuoteVolume: roundToTwo(candle.quoteAssetVolume),
           BuyVolume: roundToTwo(candle.takerBuyQuoteAssetVolume),
           SellVolume: roundToTwo(candle.quoteAssetVolume - candle.takerBuyQuoteAssetVolume),
           closeTime: candle.closeTime,
           trades: candle.trades, 

        }

   candles15mArray.forEach( async (candle, i)  => {
      close15m.push(candle.close); 
   });
     });
   
     return candlesAndindicators15m;
  }

async function GetSupAndRes(sygnal = 'BTCBUSD', dephInterval = '50') {
   const arg = await api.depth(sygnal, dephInterval);
   const arrayBidValue= [];
   const arrayAskValue = [];
   const arrayBidSup = [];
   const arrayAsk2Res = [];
   const relation = [];

   const result = []
   arg.bids.forEach(async (bid, i) => {
      relation .push(bid[0], bid[1]);
      arrayBidValue.push(bid[1]);
      arrayBidSup.push(bid[0]);
   });
   arg.asks.forEach(async (ask, i) => {
      arrayAskValue.push(ask[1]);
      arrayAsk2Res.push(ask[0]);
   });

   // Search value in array
  
   // Search into the array for the highest value
   const maxBidValue = Math.max(...arrayBidValue);
   const maxAskValue = Math.max(...arrayAskValue);
      

   // Search into the array for the lowest value
   arrayAskValue.forEach(async (ask, i) => {
      const ashRounded = roundToTwo(ask);
      const maxAskRounded = roundToTwo(maxAskValue);
      if (ashRounded === maxAskRounded) {
         var Resistencia = arrayAsk2Res[i];
         result.push(Resistencia);
      }
   });
  
   arrayBidValue.forEach(async (bid, i) => {
      const bidRounded = roundToTwo(bid);
      const maxBidRounded = roundToTwo(maxBidValue);
      if (bidRounded === maxBidRounded) {
        var Suporte = arrayBidSup[i];
        result.push(Suporte);
      }

   });

   const supRes = { 
      "Resistencia" : roundToTwo(result[0]),
      "Suporte" : roundToTwo(result[1])
   }


   return supRes
    
}
const run = async() => {
   const node = await GetSupAndRes('BNBBUSD', '10');
   console.log(node);

}

run();


module.exports = {
      getCandleStatistc,
      getRSI,
      getMMA,
      formatBinaceDates,
      callIndicators,
      roundToTwo
}


   
