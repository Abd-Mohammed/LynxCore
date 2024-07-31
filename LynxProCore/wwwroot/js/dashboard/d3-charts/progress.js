/* ------------------------------------------------------------------------------
 *
 *  # D3.js v3 - Progress Chart
 * ---------------------------------------------------------------------------- */

function ProgressRoundedChart(element, color, end, iconClass, textTitle) {

    if (typeof d3 == 'undefined') {
        console.warn('Warning - d3.min.js is not loaded.');
        return;
    }

    if (typeof (end) !== 'undefined' && end !== null) {

        // Initialize chart only if element exsists in the DOM
        if ($(element).length > 0) {

            // Basic setup
            // ------------------------------

            // Main variables
            var d3Container = d3.select(element),
                startPercent = 0,
                iconSize = 32,
                endPercent = end,
                twoPi = Math.PI * 2,
                formatPercent = d3.format('.0%'),
                boxSize = 38 * 2;

            // Values count
            var count = Math.abs((endPercent - startPercent) / 0.01);

            // Values step
            var step = endPercent < startPercent ? -0.01 : 0.01;

            if (d3Container.selectAll('svg').size() == 1) {
                //Remove old chart to load new one
                d3.select(element).selectAll("svg").remove();
                d3.select(element).selectAll("h2").remove();
                d3.select(element).selectAll("i").remove();
                d3.select(element).selectAll("div").remove();
            }

            // Create chart
            // ------------------------------

            // Add SVG element
            var container = d3Container.append('svg');

            // Add SVG group
            var svg = container
                .attr('width', boxSize)
                .attr('height', boxSize)
                .append('g')
                .attr('transform', 'translate(' + (boxSize / 2) + ',' + (boxSize / 2) + ')');



            // Construct chart layout
            // ------------------------------

            // Arc
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(38)
                .outerRadius(38 - 2);



            //
            // Append chart elements
            //

            // Paths
            // ------------------------------

            // Background path
            svg.append('path')
                .attr('class', 'd3-progress-background')
                .attr('d', arc.endAngle(twoPi))
                .style('fill', color)
                .style('opacity', 0.1);

            // Foreground path
            var foreground = svg.append('path')
                .attr('class', 'd3-progress-foreground')
                .attr('filter', 'url(#blur)')
                .style('fill', color)
                .style('stroke', color);

            // Front path
            var front = svg.append('path')
                .attr('class', 'd3-progress-front')
                .style('fill', color)
                .style('fill-opacity', 1);



            // Text
            // ------------------------------

            // Percentage text value
            var numberText = d3.select(element)
                .append('h2')
                .attr('class', 'pt-1 mt-2 mb-1')

            // Icon
            d3.select(element)
                .append('i')
                .attr('class', iconClass + ' counter-icon')
                .attr('style', 'top: ' + ((boxSize - iconSize) / 2) + 'px').style('color', color);// MS Added //.style('color', color)


            // Title
            d3.select(element)
                .append('div')
                .text(textTitle)
                .attr('style', 'font-weight:bold;font-size: 15px');

            // Subtitle
            d3.select(element)
                .append('div')
                .attr('class', 'font-size-sm text-muted margin-bottom-10')
                .text('');



            // Animation
            // ------------------------------
            
            // Animate text
            var progress = startPercent;
            (function loops() {
                updateProgress(progress, foreground, front, numberText, arc, formatPercent, twoPi);
                if (count > 0) {
                    count--;
                    progress += step;
                    setTimeout(loops, 10);
                }
            })();
        }
    }
}

// Animate path
function updateProgress(progress, foreground, front, numberText, arc, formatPercent, twoPi) {
    foreground.attr('d', arc.endAngle(twoPi * progress));
    front.attr('d', arc.endAngle(twoPi * progress));
    numberText.text(formatPercent(progress));
}

