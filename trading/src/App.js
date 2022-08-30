
import './App.css';
import { getCandles } from './services/dataservice';
import React from 'react';
import { useEffect, useState } from 'react';
import Chart from './components/chart'

function App() {
  
  const [symbol, setSymbol] = useState('BTCBUSD')
  const [interval, setInterval ] = useState('15m')
  const [data, setData] = useState([]);

  useEffect(() => {
    getCandles().then(res => {
      setData(res)
      console.log(res)
      console.log(data)
    }).catch(err => console.log(err))

  }, [])
  
  function onIntervalChange(event) {
    setInterval(event.target.value)
  }

  function onSymbolChange(event) {
    setSymbol(event.target.value)
  }

  // const { lastJsonMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`, {
  //   onOpen: () => console.log(`Connected to App WS`),
  //   onMessage: () => {
  //     if (lastJsonMessage) {
  //       const newCandle = new Candle(lastJsonMessage.k.t, lastJsonMessage.k.o, lastJsonMessage.k.h, lastJsonMessage.k.l, lastJsonMessage.k.c);
  //       const newData = [...data];
  //       if (lastJsonMessage.k.x === false) { //candle incompleto
  //         newData[newData.length - 1] = newCandle;//substitui último candle pela versão atualizada
  //       }
  //       else {//remove candle primeiro candle e adiciona o novo último
  //         newData.splice(0, 1);
  //         newData.push(newCandle);
  //       }
 
  //       setData(newData);
  //     }
  //   },
  //   onError: (event) => console.error(event),
  //   shouldReconnect: (closeEvent) => true,
  //   reconnectInterval: 3000
  // });

  
  return (
      <>
     <select onChange={onSymbolChange} value={symbol}>
      <option> BTCBUSD </option>
     </select>
     <select onChange={onIntervalChange} values={interval}> 
      <option>
        15m
      </option>
     </select>
       <Chart data={data} />
      </>
    );
}

export default App;
