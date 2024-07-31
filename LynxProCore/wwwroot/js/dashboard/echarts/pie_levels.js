/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Pie Chart with levels
 * ---------------------------------------------------------------------------- */
var pie_levels;
function EchartsPieChart(data) {
 
    // Pie chart with levels
    if (typeof echarts == 'undefined') {
        console.warn('Warning - echarts.min.js is not loaded.');
        return;
    }

    // Define element
   var pie_levels_element = document.getElementById('pie_levels');

    // Charts configuration
    if (typeof (data) !== 'undefined') {        
        if (pie_levels_element) {
            //Remove old chart
            if (typeof (pie_levels) !== 'undefined' && pie_levels != '') {
                pie_levels.clear();
            }

            // Initialize chart
            pie_levels = echarts.init(pie_levels_element);
           
            // Options            
            pie_levels.setOption({

                // Colors
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],

                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Add tooltip
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: [10, 15],
                    textStyle: {
                        color: '#222',
                        fontSize: 13,
                        fontFamily: 'Roboto, sans-serif'
                    },
                    formatter: (params) => {
                        return `Time:${params.seriesName} <br/>${params.data.name}: ${params.data.value} (${params.percent}%)`;
                    }
                },

                // Add legend
                legend: {
                    orient: 'vertical',
                    top: 0,
                    left: 0,
                    data: data.name,
                    itemHeight: 8,
                    itemWidth: 8,
                    textStyle: {
                        color: '#fff'
                    }
                },

                // Add series               
                series: (function () {
                    var series = [];
                    var par = data.result.length;
                    for (var i = 0; i < par; i++) {
                        var setData = {
                            name: data.result[i]["time"],
                            type: 'pie',
                            hoverOffset: 0,
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    borderColor: '#353f53',
                                    label: {
                                        show: i == par - 1,
                                    },
                                    labelLine: {
                                        show: i == par - 1,
                                        length: 20
                                    }
                                }
                            },
                            radius: [i * 3.6 + 40, i * 3.6 + 43],
                            center: ['55%', '52%'],
                            data: []
                        }
                        for (var j = 0; j < data.result[i]["value"].length; j++) {
                            setData.data.push({ value: data.result[i]["value"][j], name: data.result[i]["name"][j] });
                        }
                        series.push(setData);
                    }
                    return series;
                })()
            });
        }


        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            pie_levels_element && pie_levels.resize();
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



