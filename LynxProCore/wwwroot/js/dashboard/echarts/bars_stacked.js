/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Stacked bar chart
 * ---------------------------------------------------------------------------- */
var bars_stacked;
function EchartsBarsStacked(data) {

    if (typeof echarts == 'undefined') {
        console.warn('Warning - echarts.min.js is not loaded.');
        return;
    }

    // Define element
    var  bars_stacked_element = document.getElementById('bars_stacked');

    // Remove old chart
    if (typeof (bars_stacked) !== 'undefined' && bars_stacked != '') {
        bars_stacked.clear();
    }

     // Charts configuration
    if (typeof (data) !== 'undefined' && data.result.length > 0) {

        if (bars_stacked_element) {

            // Initialize chart
            bars_stacked = echarts.init(bars_stacked_element);

            // Options
            bars_stacked.setOption({

                title: {
                    text: 'Lowest 10 Drivers',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: 16,
                        fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    },
                    subtextStyle: {
                        align: 'center'
                    }
                },
                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Chart animation duration
                animationDuration: 750,

                // Setup grid
                grid: {
                    left: 0,
                    right: 30,
                    top: 70,
                    bottom: 0,
                    containLabel: true
                },

                // Add legend
                legend: {
                    // data: data.name,
                    data: [],
                    itemHeight: 8,
                    itemGap: 20,
                    textStyle: {
                        padding: [0, 5],
                        color: '#fff'
                    }
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    formatter: (params) => {
                        var alerts = params[0].data[2].replaceAll(",", "<br /> - ");
                        return `${params[0].data[3]} (${params[0].data[1]})` + '<br />' + `${params[0].marker} Score: ${params[0].data[0]} %` + '<br />' +
                            `Alerts : <br /> - ${alerts}`;
                    },
                    padding: [10, 15],
                    textStyle: {
                        color: '#222',
                        fontSize: 13,
                        fontFamily: 'Roboto, sans-serif'
                    },
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },

                // Horizontal axis
                xAxis: [{
                    type: 'value',
                    min: 0,
                    max: 100,
                    axisLabel: {
                        color: '#fff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            type: 'dashed'
                        }
                    }
                }],

                // Vertical axis
                yAxis: [{
                    type: 'category',
                    data: data.driverStaffIds,
                    axisLabel: {
                        color: '#fff',
                        formatter: (value, index) => {
                            if (value.length > 14)
                                return value.substring(0, 14) + '..';
                            return value;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(255,255,255,0.01)', 'rgba(0,0,0,0.01)']
                        }
                    }
                }],

                // Add series
                series:
                    (function () {
                        var series = [];
                        var setData = {
                            name: 'Score ',
                            type: 'bar',
                            stack: 'Total',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: (elementData) => {
                                        var score = elementData.value[0];
                                        if (score >= 85) {
                                            return '#2fcc58';
                                        }
                                        if (score >= 60) {
                                            return '#dfba49';
                                        }
                                        return '#F3565D';
                                    },
                                    label: {
                                        show: true,
                                        position: 'inside',
                                        padding: [0, -20],
                                        fontSize: 12
                                    }
                                }                         
                            },
                            data: data.result
                        }
                        series.push(setData);
                        return series;
                    })()
            });
        }


        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            bars_stacked_element && bars_stacked.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function () {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    }
}

