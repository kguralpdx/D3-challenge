 // Set up the SVG area
 // Store the dimensions of the SVG container
var svgWidth = 855;
var svgHeight = 600;

// Create an object to represent the chart's margins within the SVG container
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
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
      // Step 5: Create the scales for the chart
      // =================================
    var xLinearScale = d3.scaleLinear()
      // Since there's a margin of error for each poverty percentage, need to subtract that from min poverty and 
      // add it to max poverty values
      .domain([d3.min(data, d => d.poverty - d.povertyMoe ), d3.max(data, d => d.poverty + d.povertyMoe )])
      //.domain(d3.extent(data, d => d.poverty))
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

    // // Step 8: Append the axes to the chartGroup
    // // ==============================================
    // // Add x-axis
    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${chartHeight})`)
    //   .call(bottomAxis);

    // // Add y-axis
    // chartGroup.append("g").call(leftAxis);

    //   // Append axes titles
    // chartGroup.append("text")
    //   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
    //   .classed("poverty-text text", true)
    //   .text("In Poverty (%)");

    // chartGroup.append("text")
    // .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 37})`)
    //   .classed("healthcare-text text", true)
    //   .text("Lacks Healthcare (%)");

    // append circles
  
    let circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "royalblue")
      .attr("fill-opacity", "0.4")
      .attr("stroke-width", "1")
      .attr("stroke", "midnightblue");

      // d3.select("#scatter")
      //   .append("svg")
      //   .attr("height", svgHeight)
      //   .attr("width", svgWidth);

    let circleText = chartGroup.selectAll('text')
      .data(data)
      .join("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare))
      .attr("font-family", "arial")
      .attr("font-size", "10px")
      .attr("font-weight", 'bold')
      .attr("fill", "midnightblue")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central");
      
      //   .attr("x", function (d) {
      //       return x(d.x);
      //   })
      //   .attr("y", function (d) {
      //       return y(d.y);
      //   });

          // Create axes labels

        // Step 8: Append the axes to the chartGroup
    // ==============================================
    // Add x-axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // Add y-axis
    chartGroup.append("g").call(leftAxis);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");


 
  }).catch(error => console.log(error));



