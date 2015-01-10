// Load the JSON data, parse it, and render / populate the d3 graph

// Default day-view graph to be rendered
function renderDayGraph(){


	// Width, height and padding
	var width = 1250;
	var height = 567;
	var padding = 60;

	// Time format
	var parseDate = d3.time.format("%H:%M").parse;
	var formatTime = d3.time.format("%H:%M");

	//Create scale functions
	var xScale = d3.time.scale()
						 .range([padding, width - padding * 2]);
		

	var yScale = d3.scale.linear()
						.domain([0,3500])
						 .range([height - padding, padding]);
				
	// Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
				.tickFormat(d3.time.format("%H:%M"));

	// Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .tickFormat(d3.format("d"));

	// Define 'div' for tooltips
	var div = d3.select("body")
    	.append("div")  // declare the tooltip div 
    	.attr("class", "tooltip")
    	.style("opacity", 0);


	// Create SVG element
	var svg = d3.select(".chart")
				.append("svg")
				.attr("class", "n")
				.attr("width", width)
				.attr("height", height)
				.attr("font-size", 18)

	var min = Number.MAX_VALUE;
	var max = 0;
    var average = 0;
    var timedOut = 0;

    // Loop through ping data and get the date, ping and calculate the average
	(januaryPings.pings).forEach(function(d){
		d.time = parseDate(d.time);
		d.ping = +d.ping;
		average = average + (+d.ping);
		if(d.ping < min && d.ping != -1){min = d.ping};
		if(d.ping > max){max = d.ping};
		if(d.ping == -1){timedOut = timedOut + 1};
	});

	// Calculate average ping and format to 2 sig figs.
	average = average / ((januaryPings.pings).length);
	var formatAverage = d3.format("r"),
    	formatRoundedAverage = function(x) { return formatAverage(d3.round(x, 2)); };

    // Calculate % of day spent timed-out :(
	timedOut = timedOut * 2;
	var secondsInADay = 86400;
	timedOut = timedOut / secondsInADay;
	var formatTimedOut = d3.format("p"),
    	formatRoundedTimedOut = function(x) { return formatTimedOut(d3.round(x, 3)); };

    // add in min, max, average and timed-out to table
	d3.select(".min-ping")
		.text(min + " ms");
	d3.select(".max-ping")
		.text(max + " ms");
	d3.select(".average-ping")
		.text(formatRoundedAverage(average) + " ms");
	d3.select(".timed-out")
		.text(formatRoundedTimedOut(timedOut));

	xScale.domain(d3.extent(januaryPings.pings, function(d) { return d.time; }));
	//yScale.domain([0, d3.max(januaryPings.pings, function(d) { return d.ping; })]); <-- Uncomment for dynamic y range



	// Create circles
	svg.selectAll("circle")
	   .data(januaryPings.pings)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
	   		return xScale(d.time);
	   })
	   .attr("cy", function(d) {
	   		if(d.ping == "-1") {return yScale("3500")}
	   		else { return yScale(d.ping)};
	   })
	   .attr("r", 0.75)
	   .style("fill", function(d) {            
            if (d.ping == "-1") {return "red"}  
            else    { return "white" };      
        })
	   .attr("stroke-width", 4)
       .attr("stroke", "black")
       .style("stroke-opacity", 0.0)
	   .on("mouseover", function(d) {        
            div.transition()
                .duration(500)    
                .style("opacity", 0);
            div.transition()
                .duration(200)    
                .style("opacity", .9);    
            div .html(function() {
		   		if(d.ping == "-1") {
		   			return "Time : " + formatTime(d.time) + "<br>"
	                + "Ping : " + "Timeout"  
        		}
		   		else { 
		   			return "Time : " + formatTime(d.time) + "<br>"
	                + "Ping : " + d.ping
				}})
				.style("left", (d3.event.pageX) + "px")             
                .style("top", (d3.event.pageY - 28) + "px");
            });



	// X axis time label
	svg.append("text")
    	.attr("class", "x label")
    	.attr("text-anchor", "end")
    	.attr("y", height-padding+8)
    	.attr("x", width-padding*2-8)
    	.attr("dy", ".75em")
    	.attr("fill", "gray")
   		.text("time (H:M)");

	// Y axis latency label
	svg.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "end")
    	.attr("y", padding + 6)
    	.attr("x", -padding)
    	.attr("dy", ".75em")
    	.attr("transform", "rotate(-90)")
    	.attr("fill", "gray")
   		.text("latency (ms)");

	// Append the X axis to the SVG
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis);

	// Append the Y axis to the SVG
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);



}


renderDayGraph();