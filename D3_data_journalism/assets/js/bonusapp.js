 // Set up the SVG area
 // Store the dimensions of the SVG container
var svgWidth = 855;
var svgHeight = 600;

// Create an object to represent the chart's margins within the SVG container
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 80
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
let chosenXAxisBubble = "In Poverty";
let chosenYAxisBubble = "Lacks Healthcare";
let chosenXFormat = '%'

// function used for updating x-scale var upon click on x axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis] - d[chosenXAxis + "Moe"]), 
      d3.max(data, d => d[chosenXAxis]+ d[chosenXAxis + "Moe"])
    ])
    .range([0, chartWidth])
    .nice();
  return xLinearScale;
}

// Function used for updating y-scale var upon click on y axis label
function yScale(data, chosenYAxis) {
    // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[chosenYAxis]))
    .range([chartHeight, 0])
    .nice();
  return yLinearScale;
}

// function used for updating xAxis var upon click on x axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on y axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles for x axis
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
   return circlesGroup;
}

// function used for updating circle labels group with a transition to
// new circles
function renderCircleLabels(label, newXScale, chosenXAxis) {
  label.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
  return label;
}

// function used for updating circles group with a transition to
// new circles for y axis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
    return circlesGroup;
}
  
// function used for updating circle labels group with a transition to
// new circles
function renderYCircleLabels(label, newYScale, chosenYAxis) {
  label.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]))
  return label;
}
 
// Get the data
d3.csv("./assets/data/data.csv", d3.autoType).then((data) => {
  console.log(data);

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(data, chosenYAxis);

  // Create the initial axes functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Create what appears in tooltip
  let tooltip = function(d) {
    return `<strong>${d.state}</strong><br>${chosenXAxisBubble}: 
      <span style='color:lightsteelblue'>${d[chosenXAxis]}${chosenXFormat}</span>
      <br>${chosenYAxisBubble}: <span style='color:lightsteelblue'>${d[chosenYAxis]}%</span>`
  }

  // Append initial circles
  var circlesGroup = chartGroup.append("g")
    .selectAll("circle")
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
      .html(tooltip)
      .offset([-10, 0])
      .show)
    .on('mouseout', tip.hide);
  circlesGroup.append("title");

  // Append state abbreviations to center of circles
  var label = chartGroup.append("g")
    .attr("font-weight", 800)
    .attr("text-anchor", "middle")
    .selectAll('text')
    .data(data)
    .join("text")
    .attr("id", "stateAbbr")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .attr("font-family", "arial")
    .attr("font-size", "10px")
    .attr("fill", "midnightblue")
    .attr("alignment-baseline", "central")
    .text(d => d.abbr);

  label.append("title");

  // Append the axes to the chartGroup
  // Add x-axis
  var xAxis = chartGroup.append("g")
    .classed("xaxis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
  
  // Add y-axis
  var yAxis = chartGroup.append("g")
    .classed("yaxis", true)
    .call(leftAxis);

    // Create group for three x-axis labels
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

  var incomeLabel = labelsGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 60)
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median $)");

  // Create group for three y-axis labels
  var labelsGroupY = chartGroup.append("g")
    .attr("transform", `translate( -10, 0)`); 

  // Add y axis title
  var healthcareLabel = labelsGroupY.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 20)
    .attr("x", 0 - (chartHeight / 2))
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = labelsGroupY.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = labelsGroupY.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 60)
    .attr("x", 0 - (chartHeight / 2))
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circle labels with new x values
        label = renderCircleLabels(label, xLinearScale, chosenXAxis);

        // Update tip text
        switch(chosenXAxis) {
          case 'age':
            chosenXAxisBubble = "Age (Median)";
            chosenXFormat = "";
            break;
          case 'poverty':
            chosenXAxisBubble = "In Poverty";
            chosenXFormat = "%";
            break;
          case 'income':
            chosenXAxisBubble = "Household Income (Median $)";
            chosenXFormat = "";
            break;
        }

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
    });

  // y axis labels event listener
  labelsGroupY.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates circle labels with new y values
      label = renderYCircleLabels(label, yLinearScale, chosenYAxis);

      // Update tip text
      switch(chosenYAxis) {
        case 'smokes':
          chosenYAxisBubble = "Smokes";  
          break;
        case 'healthcare':
          chosenYAxisBubble = "Lacks Healthcare";
          console.log(chosenYAxis);
          break;
        case 'obesity':
          chosenYAxisBubble = "Obese";
          console.log(chosenYAxis);
          break;
      }

      // changes classes to change bold text
      if (chosenYAxis === "smokes") {
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
      } else if (chosenYAxis === "healthcare") {
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
      } else {
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

  // Remove the first y axis tick
  svg.selectAll(".yaxis").select(".tick")
    .filter(d => d < 6)
    .remove();

  // Remove the first x axis tick
  svg.selectAll(".xaxis").select(".tick")
    .filter(d => d < 10)
    .remove();
 
}).catch(error => console.log(error));



