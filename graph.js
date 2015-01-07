// Load the JSON data, parse it, and render / populate the d3 graph

// Default day-view graph to be rendered
function renderDayGraph(){
	
	//Width and height
	var width = 800;
	var height = 450;
	var padding = 40;
	var parseDate = d3.time.format("%H:%M").parse;

	//Create scale functions
	var xScale = d3.time.scale()
						 .range([padding, width - padding * 2]);
		

	var yScale = d3.scale.linear()
						 .range([height - padding, padding]);
				
	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
				.tickFormat(d3.time.format("%H:%M"));

	//Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .tickFormat(d3.format("d"));

	//Create SVG element
	var svg = d3.select(".chart")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	

	(jsonPings.pings).forEach(function(d){
		d.time = parseDate(d.time);
		d.ping = +d.ping;
	});


	xScale.domain(d3.extent(jsonPings.pings, function(d) { return d.time; }));
	yScale.domain([0, d3.max(jsonPings.pings, function(d) { return d.ping; })]);


    
	//Create circles
	svg.selectAll("circle")
	   .data(jsonPings.pings)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
	   		return xScale(d.time);
	   })
	   .attr("cy", function(d) {
	   		return yScale(d.ping);
	   })
	   .attr("r", 0.6)
	   .attr("fill", "white");

	/*
	//Create labels
	svg.selectAll("text")
	   .data(dataset)
	   .enter()
	   .append("text")
	   .text(function(d) {
	   		return d[0] + "," + d[1];
	   })
	   .attr("x", function(d) {
	   		return xScale(d[0]);
	   })
	   .attr("y", function(d) {
	   		return yScale(d[1]);
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "red");
		*/

	//Y axis label
	svg.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "end")
    	.attr("y", padding + 6)
    	.attr("x", -padding)
    	.attr("dy", ".75em")
    	.attr("transform", "rotate(-90)")
    	.attr("fill", "gray")
   		.text("latency (ms)");

	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
}


renderDayGraph();