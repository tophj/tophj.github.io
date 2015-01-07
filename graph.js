// Load the JSON data, parse it, and render / populate the d3 graph


function renderGraph(){
	
	//Width and height
	var w = 700;
	var h = 350;
	var padding = 40;

	var parseDate = d3.time.format("%H:%M").parse;

	//Create scale functions
	var xScale = d3.time.scale()
						 .range([padding, w - padding * 2]);

	var yScale = d3.scale.linear()
						 .domain([0, 3000])
						 .range([h - padding, padding]);
	// radius
	var rScale = d3.scale.linear()
						 .domain([0, 3000])
						 .range([2, 5]);

	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
				.tickFormat(d3.time.format("%H:%M"));

	//Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(5);

	//Create SVG element
	var svg = d3.select(".chart")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	(jsonPings.pings).forEach(function(d){
		d.time = parseDate(d.time);
	});


	xScale.domain(d3.extent(jsonPings.pings, function(d) { return d.time; }));
    
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
	   .attr("r", 1)
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

	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
}


renderGraph();