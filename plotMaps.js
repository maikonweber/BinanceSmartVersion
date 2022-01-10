import d3 from 'd3';]
import { getCandleStatistc } from '.candles.js'



async function getData(sygnal, time, interval) {
    const data = await getCandleStatistc(sygnal, time, interval);
    return data;
}   


// This function is used to plot the map
// Plot the candlesstick maps
// Which information of candles.js


async function renderMap() {
    const width = 500;
    const height = 500;
    const candles = d3.select('.candlesGraph')
    candles.append('div').attr('class', 'candlesGraph')
    const svg = candles.append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');


    const data = await getData('BTC-USD', '1h', '1m');
    const candlesData = data.map(d => {
        return {
            date: new Date(d.time),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume
        }
    })
    const x = d3.scaleTime()
    .domain(d3.extent(candlesData, d => d.date))
    .range([0, width]);

    const y = d3.scaleLinear()
    .domain([d3.min(candlesData, d => d.low), d3.max(candlesData, d => d.high)])
    .range([height, 0]);

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

    const x = d3.scaleTime()
    .domain(d3.extent(candlesData, d => d.date))
    .range([0, width]);

    const y = d3.scaleLinear()
    .domain([d3.min(candlesData, d => d.low), d3.max(candlesData, d => d.high)])
    .range([height, 0]);

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

    svg.append('path')
    .datum(candlesData)
    .attr('class', 'candle')
    .attr('d', line);

    svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

    svg.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y));

    svg.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50)
    .attr('x', -height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Price ($)');

    svg.append('text')
    .attr('class', 'axis-label')
    .attr('y', height / 2)
    .attr('x', width / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Date');

    svg.append('text')
    .attr('class', 'title')
    .attr('y', -50)
    .attr('x', width / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Candles Stick Chart');

    svg.append('text')
    .attr('class', 'subtitle')
    .attr('y', -30)
    .attr('x', width / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Bitcoin Price');

    svg.append('text')
    .attr('class', 'subtitle')
    .attr('y', -10)
    .attr('x', width / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('1h');
}

module.exports = {
    renderMap
}