import React, {useEffect} from 'react'

import { Line } from 'react-chartjs-2';

import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipitem, data) {
                return numeral(tooltipitem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

function LineGraph({ casesType = 'cases' }) {

    const [data, setData] = React.useState({});

    const buildChartdata = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const ChartData = buildChartdata(data);
                setData(ChartData);
            });
        };

        fetchData();
    }, [casesType]);

    return (
        <div>
            {
                data?.length > 0 && (
                    <Line
                        options={options}
                        data={{
                            datasets: [{
                                data: data,
                                borderColor: "#CC1034",
                                backgroundColor: "rgba(204,16,52,0.5)"
                            }]
                        }}
                    />
                )
            }
        </div>
    )
}

export default LineGraph
