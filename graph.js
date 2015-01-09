// Load the JSON data, parse it, and render / populate the d3 graph

// Default day-view graph to be rendered
function renderDayGraph(){
	
	jsonPings.pings = JanuaryPings.pings;

	//Width and height
	var width = 1250;
	var height = 567;
	var padding = 60;
	var parseDate = d3.time.format("%H:%M").parse;

	//Create scale functions
	var xScale = d3.time.scale()
						 .range([padding, width - padding * 2]);
		

	var yScale = d3.scale.linear()
						.domain([0,3500])
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
				.attr("height", height)
				.attr("font-size", 18);
	// Can uncomment later to add back in mean line
    //var mean = 0;

    //Loop through ping data and get the date, ping and calculate the mean
	(jsonPings.pings).forEach(function(d){
		d.time = parseDate(d.time);
		d.ping = +d.ping;
		//mean = mean + (+d.ping);
	});



	// mean = mean / ((jsonPings.pings).length)

	// //Add mean line to svg
	// var median = svg.append("line")
 //                 .attr("x1", padding-6)
 //                 .attr("y1", yScale(mean))
 //                 .attr("x2", width - padding *2)
 //                 .attr("y2", yScale(mean))
 //                 .attr("stroke-width", 2)
 //                 .attr("stroke", "red");

 //    svg.append("text")
 //    	.attr("class", "y label")
 //    	.attr("text-anchor", "start")
 //    	.attr("y", yScale(mean))
 //    	.attr("x", padding -40)
 //    	.attr("fill", "red")
 //   		.text(mean);


	xScale.domain(d3.extent(jsonPings.pings, function(d) { return d.time; }));
	//yScale.domain([0, d3.max(jsonPings.pings, function(d) { return d.ping; })]); <-- Uncomment for dynamic y range


    
	//Create circles
	svg.selectAll("circle")
	   .data(jsonPings.pings)
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