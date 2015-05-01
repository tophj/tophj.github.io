// Load the JSON data, parse it, and render / populate the d3 graph


//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************

var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = parseInt(d3.select('.chart').style('width'), 10),
    width = width - margin.left - margin.right,
    height = width / 2;

// Time format
var parseDate = d3.time.format("%H:%M").parse;
var formatTime = d3.time.format("%H:%M");


var x = d3.time.scale()
					 .range([1, width]);
	
var y = d3.scale.linear()
					.domain([0,3500])
					 .range([height, 0]);		

var xAxis = d3.svg.axis()
				  .scale(x)
				  .orient("bottom")
			.tickFormat(d3.time.format("%H:%M"));

var yAxis = d3.svg.axis()
				  .scale(y)
				  .orient("left")
				  .tickFormat(d3.format("d"));

// Define 'div' for tooltips
var div = d3.select("body")
	.append("div")  // declare the tooltip div 
	.attr("class", "tooltip")
	.style("opacity", 0);


		

//************************************************************
// Loop through data to get statistics
//************************************************************

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

//Create dynamic range for x and y axis
x.domain(d3.extent(januaryPings.pings, function(d) { return d.time; }));
//y.domain([0, d3.max(januaryPings.pings, function(d) { return d.ping; })]);




//************************************************************
// Create our SVG object, add labels and axis
//************************************************************	

var svg = d3.select(".chart")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.attr("font-size", 18)
	.append("g")
	 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X axis time label
svg.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "end")
	.attr("y", height+8)
	.attr("x", width-8)
	.attr("dy", ".75em")
	.attr("fill", "white")
		.text("time (H:M)");

// Y axis latency label
svg.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("y", 6)
	.attr("x", -4)
	.attr("dy", ".75em")
	.attr("transform", "rotate(-90)")
	.attr("fill", "white")
		.text("latency (ms)");

// Append the X axis to the SVG
svg.append("g")
	.attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
	.call(xAxis);

// Append the Y axis to the SVG
svg.append("g")
	.attr("class", "yaxis")
	.call(yAxis);



//************************************************************
// Create our color gradient
//************************************************************	
var gradient = svg
    .append("linearGradient")
    .attr("y1", "0%")
    .attr("y2", "100%")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("id", "gradient")
    .attr("gradientUnits", "userSpaceOnUse")

// max latency to about 1200 should be red
gradient.append("stop")
    .attr("class","top-red-start")
    .attr("offset", "0%")
    .attr("stop-color", "#f00")

gradient.append("stop")
    .attr("class","top-red-stop")
    .attr("offset", "65.71%")
    .attr("stop-color", "#f00")
// 1200 - 500 should be red-yellow gradient

gradient.append("stop")
    .attr("class","gradient-red-start")
    .attr("offset", "65.71%")
    .attr("stop-color", "#f00")

gradient.append("stop")
.attr("class","gradient-yellow-stop")
    .attr("offset", "85.71%")
    .attr("stop-color", "#ff0")
// 500 - 0 should be yellow-yellow green
    
gradient.append("stop")
.attr("class","gradient-yellow-start")
    .attr("offset", "85.71%")
    .attr("stop-color", "#ff0")
    
gradient.append("stop")
.attr("class","gradient-green-stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0f0")



//************************************************************
// Generate our circles from the database
//************************************************************	
var circles = svg.selectAll("circle")
   .data(januaryPings.pings)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
   		return x(d.time);
   })
   .attr("cy", function(d) {
   		if(d.ping == "-1") {return y("3500")}
   		else { return y(d.ping)};
   })
   .attr("r", 0.8)
   .style("fill", function(d) {            
         if (d.ping == "-1") {return "white"}
         else { return "url(#gradient)" };      
    })
   .attr("stroke-width", 4)
   .attr("stroke", "black")
   .style("stroke-opacity", 0.0);


//************************************************************
// Add our circle tooltips
//************************************************************	
circles.on("mouseover", function(d) {        
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
})
.on("mouseout", function(d) { 
	div.transition()
		.duration(700)    
    	.style("opacity", 0); 
});

//************************************************************
// Resize graph because of window resize
//************************************************************  


function resize() {

  var width = parseInt(d3.select(".chart").style("width"),10),
  width = width - margin.left - margin.right,
  height = width / 2;

  // getElementById('div_register').style.width='500px';
  // getElementById('div_register').style.width='500px';


svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)



  /* Update the range of the scale with new width/height */
  x.range([1, width]);
  y.range([height, 0]);
   
  /* Update the axis with the new scale */
  svg.select('.xaxis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
   
  svg.select('.yaxis')
    .call(yAxis);
   


  /* Force D3 to recalculate and update the circles */
  svg.selectAll("circle")
    .attr("cx", function(d) {
      return x(d.time);
   })
   .attr("cy", function(d) {
      if(d.ping == "-1") {return y("3500")}
      else { return y(d.ping)};
   })
   .attr("r", 0.8);



   svg.selectAll("gradient")
    .attr("y1", "0%")
    .attr("y2", "100%")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("gradientUnits", "userSpaceOnUse");

// max latency to about 1200 should be red
svg.selectAll("top-red-start")
    .attr("offset", "0%")
    .attr("stop-color", "#f00")

svg.selectAll("top-red-stop")
    .attr("offset", "65.71%")
    .attr("stop-color", "#f00")
// 1200 - 500 should be red-yellow gradient

svg.selectAll("gradient-red-start")
    .attr("offset", "65.71%")
    .attr("stop-color", "#f00")

svg.selectAll("gradient-yellow-stop")
    .attr("offset", "85.71%")
    .attr("stop-color", "#ff0")
// 500 - 0 should be yellow-yellow green
    
svg.selectAll("gradient-yellow-start")
    .attr("offset", "85.71%")
    .attr("stop-color", "#ff0")
    
svg.selectAll("gradient-green-stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0f0")

}
//d3.select(window).on('resize', resize);  uncomment for resizing of graph 






