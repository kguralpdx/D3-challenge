 // Set up the SVG area
 // Store the dimensions of the SVG container
var svgWidth = 855;
var svgHeight = 600;

// Create an object to represent the chart's margins within the SVG container
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) { return d; })

// Create and size the SVG container. Then append, size, and position an SVG group inside within margins defined earlier
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .call(tip)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";
//let chosenXAxisMoe = chosenXAxis + "Moe";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,// - d[chosenXAxis + "Moe"]), 
      d3.max(data, d => d[chosenXAxis]) * 1.2 //+ d[chosenXAxis + "Moe"])
    //.domain([d3.min(hairData, d => d[chosenXAxis]) * 0.8,
     // d3.max(hairData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);
  return xLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

//tip = d3.tip().attr('class', 'd3-tip').html(function(d) {return d; });
// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "poverty") {
//     label = "In Poverty (%)";
//   }
//   else {
//     label = "Age (Median)";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([80, -60])
//     .html(d => `${d.state}<br>${d[chosenXAxis]}<br>${d[chosenYAxis]}`);

//   circlesGroup.call(toolTip);

//   // circlesGroup.on("mouseover", function(data) {
//   //   toolTip.show(data);
//   // })

//   circlesGroup
//     .on("mouseover", toolTip.show)
//     // onmouseout event
//     .on("mouseout", toolTip.hide)
    
//   return circlesGroup;
// }
  
// Get the data
d3.csv("./assets/data/data.csv", d3.autoType).then((data) => {
  console.log(data);

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis)
    .nice();

  // // Create the scales for the chart
  // var xLinearScale = d3.scaleLinear()
  //   // Since there's a margin of error for each poverty percentage, need to subtract that from min poverty and 
  //   // add it to max poverty values
  //   .domain([d3.min(data, d => d.poverty - d.povertyMoe ), d3.max(data, d => d.poverty + d.povertyMoe )])
  //   //.domain(d3.extent(data, d => d.poverty))
  //   .range([0, chartWidth])
  //   .nice();
  
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.healthcareHigh))
    //.domain([0, d3.max(data, d => d.healthcare)])
    .range([chartHeight, 0])
    .nice();

  // Create the initial axes functions
  var bottomAxis = d3.axisBottom(xLinearScale);//.tickFormat(d3.timeFormat("%d-%b"));
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("fill", "royalblue")
    .attr("fill-opacity", "0.4")
    .attr("stroke-width", "1")
    .attr("stroke", "midnightblue")
    .on('mouseover', tip
      .html(d => `${d.state}<br>Poverty: ${d[chosenXAxis]}%<br>Lack Healthcare: ${d[chosenYAxis]}%`)
      .show)
    .on('mouseout', tip.hide);

  // Append state abbreviations to center of circles
  //let circleText = chartGroup.selectAll('text')
  chartGroup.selectAll('text')
    .data(data)
    .join("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .attr("font-family", "arial")
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("fill", "midnightblue")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central");

  // Append the axes to the chartGroup
  // Add x-axis
  var xAxis = chartGroup.append("g")
    .classed("xaxis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g")
    .classed("yaxis", true)
    .call(leftAxis);

    // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 20)
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 40)
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  // Add y axis title
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    //.attr("dy", "1em")
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .classed("axisText", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  //circlesGroup = updateToolTip(chosenXAxis, circlesGroup)

    // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

    // chartGroup.append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
    //   .attr("class", "axisText")
    //   .text("In Poverty (%)")
    //   .attr("font-size", "1em")
    //   .attr("font-weight", "bold");

  // Remove the first y axis tick
  svg.selectAll(".yaxis").select(".tick")
    .filter(d => d < 6)
    .remove();

  // Remove the first x axis tick
  svg.selectAll(".xaxis").select(".tick")
    .filter(d => d < 10)
    .remove();
 
}).catch(error => console.log(error));



