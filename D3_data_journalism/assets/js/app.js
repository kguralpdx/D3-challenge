 // Set up the SVG area
 // Store the dimensions of the SVG container
var svgWidth = 855;
var svgHeight = 600;

// Create an object to represent the chart's margins within the SVG container
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 60
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
    console.log(data);

    // Create the scales for the chart
    var xLinearScale = d3.scaleLinear()
      // Since there's a margin of error for each poverty percentage, need to subtract that from min poverty and 
      // add it to max poverty values
      .domain([d3.min(data, d => d.poverty - d.povertyMoe ), d3.max(data, d => d.poverty + d.povertyMoe )])
      .range([0, chartWidth])
      .nice();
      
    var yLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.healthcareHigh))
      .range([chartHeight, 0])
      .nice();

    // Create the axes
    var bottomAxis = d3.axisBottom(xLinearScale);//.tickFormat(d3.timeFormat("%d-%b"));
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append circles
    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "royalblue")
      .attr("fill-opacity", "0.4")
      .attr("stroke-width", "1")
      .attr("stroke", "midnightblue");
    circlesGroup.append("title");

    // Append state abbreviations to center of circles
    var label = chartGroup.append("g")
      .attr("font-weight", 800)
      .attr("text-anchor", "middle")
      .selectAll('text')
      .data(data)
      .join("text")
      .attr("id", "stateAbbr")
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare))
      .attr("font-family", "arial")
      .attr("font-size", "10px")
      .attr("fill", "midnightblue")
      .attr("alignment-baseline", "central")
      .text(d => d.abbr);

    label.append("title");

    // Append the axes to the chartGroup
    // Add x-axis
    chartGroup.append("g")
      .classed("xaxis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // Add y-axis
    chartGroup.append("g")
    .classed("yaxis", true)
    .call(leftAxis);

    // Add axes titles
    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (chartHeight / 2))
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .attr("font-size", "1em")
      .attr("font-weight", "bold");

    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .attr("font-size", "1em")
      .attr("font-weight", "bold");

    // Remove the first y axis tick
    svg.selectAll(".yaxis").select(".tick")
      .filter(d => d < 6)
      .remove();

    // Remove the first x axis tick
    svg.selectAll(".xaxis").select(".tick")
      .filter(d => d < 10)
      .remove();
 
  }).catch(error => console.log(error));



