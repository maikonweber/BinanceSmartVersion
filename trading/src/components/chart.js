import ApexChart  from "react-apexcharts";

export default function Chart(props) {
    console.log(props)
    const options =  {
        xasis : {
            type: ' datetime'
        },
        yaxis: {
            tooltip : {
                enabled: false
            }
        }
      }


 
    const series = [{
        data: props.data
    }]
 
    return (
        <ApexChart options={options} series={series} type="candlestick" width={940} height={880} />
    )
}