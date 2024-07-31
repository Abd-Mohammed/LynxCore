/* ------------------------------------------------------------------------------
 *  # D3.js v3 - Line chart 
 * ---------------------------------------------------------------------------- */

function SlaAlertsLineChart(element, height, data) {

    if (typeof d3 == 'undefined') {
        console.warn('Warning - d3.min.js is not loaded.');
        return;
    }

    //Remove old chart to load new one 
    d3.select(element).selectAll("svg").remove();

    // Initialize chart only if element exsists in the DOM
    if ($(element).length > 0) {

        if (typeof (data) !== 'undefined' && data.length > 0) {
            // Basic setup
            // ------------------------------

            // Main variables
            var d3Container = d3.select(element),
                margin = { top: 0, right: 0, bottom: 0, left: 0 },
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom,
                padding = 20;

            // Format date
            var format = d3.time.format("%Y-%m-%dT%H:%M:%S");
            var period = parseInt($('#Period').val());
            var formatDate;
            switch (period) {
                case 1:
                case 2:
                case 3:
                    formatDate = d3.time.format(userTimeFormat); // Display hours and minutes in 24h format
                    break;
            }

            // Colors
            var lineColor = '#fff',
                guideColor = 'rgba(255,255,255,0.3)';



            // Add tooltip
            // ------------------------------

            var tooltip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="font-size-base my-1"><i class="icon-check2 mr-2"></i>' + formatDate(d.Period) + '</div>' + '</li>' +
                        '<li>' + 'Violations: &nbsp;' + '<span class="font-weight-semibold float-right">' + d.Value + '</span>' + '</li>' +
                        '</ul>';
                });



            // Create chart
            // ------------------------------

            // Add svg element
            var container = d3Container.append('svg');

            // Add SVG group
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(tooltip);



            // Load data
            // ------------------------------

            data.forEach(function (d) {
                d.Period = format.parse(d.Period.split('.')[0]);
                d.Value = +d.Value;
            });



            // Construct scales
            // ------------------------------

            // Horizontal
            var x = d3.time.scale()
                .range([padding, width - padding]);

            // Vertical
            var y = d3.scale.linear()
                .range([height, 5]);



            // Set input domains
            // ------------------------------

            // Horizontal
            x.domain(d3.extent(data, function (d) {
                return d.Period;
            }));

            // Vertical
            y.domain([0, d3.max(data, function (d) {
                return Math.max(d.Value);
            })]);



            // Construct chart layout
            // ------------------------------

            // Line
            var line = d3.svg.line()
                .x(function (d) {
                    return x(d.Period);
                })
                .y(function (d) {
                    return y(d.Value)
                });



            //
            // Append chart elements
            //

            // Add mask for animation
            // ------------------------------

            // Add clip path
            var clip = svg.append('defs')
                .append('clipPath')
                .attr('id', 'clip-line-small');

            // Add clip shape
            var clipRect = clip.append('rect')
                .attr('class', 'clip')
                .attr('width', 0)
                .attr('height', height);

            // Animate mask
            clipRect
                .transition()
                .duration(1000)
                .ease('linear')
                .attr('width', width);



            // Line
            // ------------------------------

            // Path
            var path = svg.append('path')
                .attr({
                    'd': line(data),
                    'clip-path': 'url(#clip-line-small)',
                    'class': 'd3-line d3-line-medium'
                })
                .style('stroke', lineColor);

            // Animate path
            svg.select('.line-tickets')
                .transition()
                .duration(1000)
                .ease('linear');



            // Add vertical guide lines
            // ------------------------------

            // Bind data
            var guide = svg.append('g')
                .selectAll('.d3-line-guides-group')
                .data(data);

            // Append lines
            guide
                .enter()
                .append('line')
                .attr('class', 'd3-line-guides')
                .attr('x1', function (d, i) {
                    return x(d.Period);
                })
                .attr('y1', function (d, i) {
                    return height;
                })
                .attr('x2', function (d, i) {
                    return x(d.Period);
                })
                .attr('y2', function (d, i) {
                    return height;
                })
                .style('stroke', guideColor)
                .style('stroke-dasharray', '4,2')
                .style('shape-rendering', 'crispEdges');

            // Animate guide lines
            guide
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 150; })
                .attr('y2', function (d, i) {
                    return y(d.Value);
                });



            // Alpha app points
            // ------------------------------

            // Add points
            var points = svg.insert('g')
                .selectAll('.d3-line-circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'd3-line-circle d3-line-circle-medium')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 3)
                .style('stroke', lineColor)
                .style('fill', lineColor);



            // Animate points on page load
            points
                .style('opacity', 0)
                .transition()
                .duration(250)
                .ease('linear')
                .delay(1000)
                .style('opacity', 1);


            // Add user interaction
            points
                .on('mouseover', function (d) {
                    tooltip.offset([-10, 0]).show(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 4);
                })

                // Hide tooltip
                .on('mouseout', function (d) {
                    tooltip.hide(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            // Change tooltip direction of first point
            d3.select(points[0][0])
                .on('mouseover', function (d) {
                    tooltip.offset([0, 10]).direction('e').show(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on('mouseout', function (d) {
                    tooltip.direction('n').hide(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            // Change tooltip direction of last point
            d3.select(points[0][points.size() - 1])
                .on('mouseover', function (d) {
                    tooltip.offset([0, -10]).direction('w').show(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on('mouseout', function (d) {
                    tooltip.direction('n').hide(d);

                    // Animate circle radius
                    d3.select(this).transition().duration(250).attr('r', 3);
                })



            // Resize chart
            // ------------------------------

            // Call function on window resize
            window.addEventListener('resize', revenueResize);

            // Call function on sidebar width change
            var sidebarToggle = document.querySelector('.sidebar-control');
            sidebarToggle && sidebarToggle.addEventListener('click', revenueResize);

            // Resize function
            // 
            // Since D3 doesn't support SVG resize by default,
            // we need to manually specify parts of the graph that need to 
            // be updated on window resize
            function revenueResize() {

                // Layout variables
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                // Layout
                // -------------------------

                // Main svg width
                container.attr('width', width + margin.left + margin.right);

                // Width of appended group
                svg.attr('width', width + margin.left + margin.right);

                // Horizontal range
                x.range([padding, width - padding]);


                // Chart elements
                // -------------------------

                // Mask
                clipRect.attr('width', width);

                // Line path
                svg.selectAll('.d3-line').attr('d', line(data));

                // Circles
                svg.selectAll('.d3-line-circle').attr('cx', line.x());

                // Guide lines
                svg.selectAll('.d3-line-guides')
                    .attr('x1', function (d) {
                        return x(d.Period);
                    })
                    .attr('x2', function (d) {
                        return x(d.Period);
                    });
            }
        }
    }

}

