const api = require('./api')

const syngal = 'BTCBUSD'
const time = '5m'
const interval = 100


class KlineFormatter {
  constructor(klineData) {
    this.klineData = klineData;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  getFormattedKlines() {
    return this.klineData.map(kline => {
      return {
        openTime: this.formatDate(kline[0]),
        open: Math.round(kline[1]),
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: this.formatDate(kline[6]),
        quoteAssetVolume: kline[7],
        trades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignore: kline[11]
      };
    })
  }
    // Calculate the RSI using the time interval and period specified in the constructor
    calculateRSI(timeInterval, period) {
      let totalGain = 0;
      let totalLoss = 0;
      
      for (let i = 1; i < this.klineData.length; i++) {
        const change = this.klineData[i][4] - this.klineData[i - 1][4];
        if (change > 0) {
          totalGain += change;
        } else {
          totalLoss -= change;
        }
      }
  
      const avgGain = totalGain / period;
      const avgLoss = totalLoss / period;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    }
  
    // Calculate the MA for a given number of days
    calculateMA(candle) {
      let sum = 0.0;

      for (let i = 0; i < candle; i++) {
        
        sum += Math.round(this.klineData[this.klineData.length - 1 - i][4]);
      }
      return Math.round(sum / candle);
    }
  
    // Calculate the EMA for a given number of days and a given weight
    calculateEMA(days, weight) {
      let previousEMA;
      for (let i = this.klineData.length - 1; i >= 0; i--) {
        const currentPrice = this.klineData[i][4];
        if (previousEMA) {
          previousEMA = (currentPrice * weight) + (previousEMA * (1 - weight));
        } else {
          previousEMA = this.calculateMA(days);
        }
      }
      return Math.round(previousEMA);
    }
  
    // Calculate the volume indicator
    calculateVolumeIndicator(period) {
      let sum = 0;
      for (let i = 0; i < period; i++) {
        sum += Math.round(this.klineData[this.klineData.length - 1 - i][5]);
      }

      return Math.round(sum  / period)
    }
  }

// Example usage
// const klineData = [
//   [
//     1617440000000, // Open time
//     "0.00002861", // Open
//     "0.00002870", // High
//     "0.00002850", // Low
//     "0.00002856", // Close
//     "14.57443515", // Volume
//     1617444599999, // Close time
//     "0.41349056", // Quote asset volume
//     2460, // Trades
//     "20
