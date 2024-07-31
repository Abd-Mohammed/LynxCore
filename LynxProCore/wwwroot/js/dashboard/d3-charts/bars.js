/* ------------------------------------------------------------------------------
 *  # D3.js v3 - Bars chart
 * ---------------------------------------------------------------------------- */

function BarChart(element, data, height, animate, tooltip) {

    if (typeof d3 == 'undefined') {
        console.warn('Warning - d3.min.js is not loaded.');
        return;
    }

    //Remove old chart to load new one 
    if (d3.select(element).selectAll("svg").size() > 0 && data != null) {
        d3.select(element).selectAll("svg").remove();
    }


    // Initialize chart only if element exsists in the DOM
    if ($(element).length > 0) {

        if (typeof (data) !== 'undefined' && data != null) {
            // Basic setup
            // ------------------------------
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

            // Add data set     
            data.forEach(function (d) {
                d.Period = format.parse(d.Period.split('.')[0]);
                d.Value = +d.Value;
            });

            // Main variables
            var d3Container = d3.select(element),
                width = d3Container.node().getBoundingClientRect().width;



            // Construct scales
            // ------------------------------

            // Horizontal
            var x = d3.scale.ordinal()
                .rangeBands([0, width], 0.3);

            // Vertical
            var y = d3.scale.linear()
                .range([0, height]);



            // Set input domains
            // ------------------------------

            // Horizontal
            x.domain(data.map(function (d) { return d.Period; }));

            // Vertical
            y.domain([0, d3.max(data, function (d) { return d.Value; })]);



            // Create chart
            // ------------------------------

            // Add svg element
            var container = d3Container.append('svg');

            // Add SVG group
            var svg = container
                .attr('width', width)
                .attr('height', height)
                .append('g');



            //
            // Append chart elements
            //

            // Bars
            var bars = svg.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'd3-random-bars')
                .attr('width', x.rangeBand())
                .attr("x", function (d) { return x(d.Period); })
                .style('fill', 'rgba(255,255,255,0.5)');



            // Tooltip
            // ------------------------------

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0]);


            // Show and hide
            if (tooltip == 'closedAlerts' || tooltip == 'activeAlerts') {
                bars.call(tip)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
            }

            // Closed alerts tooltip content
            if (tooltip == 'closedAlerts') {
                tip.html(function (d, i) {
                    return '<div class="text-center">' +
                        '<h6 class="m-0">' + d.Value + '</h6>' +
                        '<span class="font-size-sm">Closed Alerts</span>' +
                        '<div class="font-size-sm">' + formatDate(d.Period) + '</div>' +
                        '</div>'
                });
            }
            // Active alerts tooltip content
            if (tooltip == 'activeAlerts') {
                tip.html(function (d, i) {
                    return '<div class="text-center">' +
                        '<h6 class="m-0">' + d.Value + '</h6>' +
                        '<span class="font-size-sm">Active Alerts</span>' +
                        '<div class="font-size-sm">' + formatDate(d.Period) + '</div>' +
                        '</div>'
                });
            }



            // Bar loading animation
            // ------------------------------

            // Choose between animated or static
            if (animate) {
                withAnimation();
            } else {
                withoutAnimation();
            }

            // Animate on load
            function withAnimation() {
                bars
                    .attr('height', 0)
                    .attr('y', height)
                    .transition()
                    .attr('height', function (d) {
                        return y(d.Value);
                    })
                    .attr('y', function (d) {
                        return height - y(d.Value);
                    })
                    .delay(function (d, i) {
                        return i * 50;
                    })
                    .duration(1200)
                    .ease('elastic');
            }

            // Load without animation
            function withoutAnimation() {
                bars
                    .attr('height', function (d) {
                        return y(d.Value);
                    })
                    .attr('y', function (d) {
                        return height - y(d.Value);
                    })
            }



            // Resize chart
            // ------------------------------

            // Call function on window resize
            window.addEventListener('resize', barsResize);

            // Call function on sidebar width change
            var sidebarToggle = document.querySelector('.sidebar-control');
            sidebarToggle && sidebarToggle.addEventListener('click', barsResize);

            // Resize function
            // 
            // Since D3 doesn't support SVG resize by default,
            // we need to manually specify parts of the graph that need to 
            // be updated on window resize
            function barsResize() {

                // Layout variables
                width = d3Container.node().getBoundingClientRect().width;


                // Layout
                // -------------------------

                // Main svg width
                container.attr('width', width);

                // Width of appended group
                svg.attr('width', width);

                // Horizontal range
                x.rangeBands([0, width], 0.3);


                // Chart elements
                // -------------------------

                // Bars
                svg.selectAll('.d3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr("x", function (d) { return x(d.Period); })
            }
        }
    }

}


