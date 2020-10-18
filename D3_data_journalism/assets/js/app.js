 // Set up the SVG area
 // Store the dimensions of the SVG container
var svgWidth = 855;
var svgHeight = 600;

// Create an object to represent the chart's margins within the SVG container
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create and size the SVG container. Then append, size, and position an SVG group inside within margins defined earlier
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 
 
 
 // Get the data
  d3.csv("./assets/data/data.csv", d3.autoType).then((data) => {
    console.log(data);// @TODO: YOUR CODE HERE!

        // Step 5: Create the scales for the chart
      // =================================
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, chartWidth])
      .nice();

    var yLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.healthcare))
      //.domain([0, d3.max(data, d => d.healthcare)])
      .range([chartHeight, 0])
      .nice();

    // Step 7: Create the axes
    // =================================
    var bottomAxis = d3.axisBottom(xLinearScale);//.tickFormat(d3.timeFormat("%d-%b"));
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 8: Append the axes to the chartGroup
    // ==============================================
    // Add x-axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // Add y-axis
    chartGroup.append("g").call(leftAxis);





 
  }).catch(error => console.log(error));



