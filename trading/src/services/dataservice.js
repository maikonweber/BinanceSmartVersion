import axios from 'axios'
import Candle from './candle'

export async function getCandles(symbol = 'BTCBUSD', interval = '15m') {
    const body =  {
        symbol, interval
    }
    const res = await axios.post('http://localhost:3000/', body)
    const candles = res.data.map(k => {
        return new Candle(k[0], k[1], k[3], k[4])
    })

    return candles
}