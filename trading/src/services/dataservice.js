import axios from 'axios'
import Candle from './candle'

export async function getCandles(symbol = 'BTCBUSD', interval = '15m') {
    const res = await axios.get('http://localhost:3055/btcbusd')
    console.log(res, "aqui no axios")
    const candles = res.data.map(k => {
        console.log(k)
        return new Candle(k[0], k[1], k[2], k[3], k[4])
    })

    return candles
}
