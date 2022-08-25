import ApexCharts  from "apexcharts";


export default function Chart(props) {
    const options = {
        xaxis : {
            type : 'datetine'
        },
        yaxis : {
            tooltip : {
                enabled : true
            }
        }
    }

const series = [
    {
        data: props.data
    }
]


return (
    <ApexCharts options={options} series={series} type='candlestick' width={640} height={480} ></ApexCharts>
    )
}
