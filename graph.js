// var dataset = [
//                   [ 5,     20 ],
//                   [ 480,   90 ],
//                   [ 250,   50 ],
//                   [ 100,   33 ],
//                   [ 330,   95 ],
//                   [ 410,   12 ],
//                   [ 475,   44 ],
//                   [ 25,    67 ],
//                   [ 85,    21 ],
//                   [ 220,   88 ]
//               ];

// var x = d3.scale.linear()
//     .domain([0, d3.max(data)])
//     .range([0, 420]);

// d3.select(".chart")
//   .selectAll("div")
//     .data(data)
//   .enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; })
//     .text(function(d) { return d; });


d3.json("http://tophj.github.io/pings.json", function(data){



//Width and height
var w = 700;
var h = 350;
var padding = 40;


console.log(data.count);
/*
//Static dataset
var dataset = [
				[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
				[410, 12], [475, 44], [25, 67], [85, 21], [220, 88],
				[600, 150]
			  ];
*/

//Dynamic, random dataset
var dataset = [];					//Initialize empty array
var numDataPoints = 50;				//Number of dummy data points to create
var xRange = 30;	//Max range of new x values
var yRange = 3000;	//Max range of new y values

//var numDataPoints = Object.keys(dataset).length
//console.log(Object.keys(data).length);

// for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
// 	var newNumber1 = Math.round(Math.random() * xRange);	//New random integer
// 	var newNumber2 = Math.round(Math.random() * yRange);	//New random integer
// 	dataset.push([newNumber1, newNumber2]);					//Add new number to array
// }

//Create scale functions
var xScale = d3.scale.linear()
					 .domain([0, 30])
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
				  .ticks(5);

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




//Create circles
svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
   		return xScale(d[0]);
   })
   .attr("cy", function(d) {
   		return yScale(d[1]);
   })
   .attr("r", function(d) {
   		return rScale(d[1]);
   })
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
});
