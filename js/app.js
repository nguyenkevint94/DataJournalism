// @TODO: YOUR CODE HERE!
// SVG dimenions
var svgHeight = 500;
var svgWidth = 700;

// Margins 
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60
};

// Creating the chart area within the SVG 
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Appending the html to include an SVG container with the chart dimensions 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Loading data from csv
d3.csv("../data/data.csv", function(error, demoData) {
    if (error) throw error
    console.log(demoData)

    // Casting CSV values as numbers, 
    demoData.forEach(function(data) {
        data.poverty = +data.poverty
        data.povertyMoe = +data.povertyMoe
        data.age = +data.age
        data.ageMoe = +data.ageMoe
        data.income = +data.income
        data.incomeMoe = +data.incomeMoe
        data.healthcare = +data.healthcare
        data.healthcareLow = +data.healthcareLow
        data.healthcareHigh = +data.healthcareHigh
        data.obesity = +data.obesity
        data.obesityLow = +data.obesityLow
        data.obesityHigh = +data.obesityHigh
        data.smokes = +data.smokes
        data.smokesLow = +data.smokesLow
        data.smokesHigh = +data.smokesHigh
    });
    
    // Scales
    let xlinearScale = d3.scaleLinear()
        .domain(d3.extent(demoData, d => d.poverty))
        .range([0, chartWidth]);

    let ylinearScale = d3.scaleLinear()
        .domain(d3.extent(demoData, d => d.obesity))
        .range([chartHeight, 0]);

    // Setting up the axes
    let bottomAxis = d3.axisBottom(xlinearScale);
    let leftAxis = d3.axisLeft(ylinearScale);

    // Appending axes to the chart
    // Appending the bottom axis
    chartGroup.append("g")
        .data(demoData)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Appending the left axis 
    chartGroup.append("g")
        .call(leftAxis);
    
    // This graph will be for OBESITY and POVERTY
    // If you want to do other graphs for the other data, we will probably have to tweak the code 

    // Bubbles and text for the plot
    let circlesGroup = chartGroup.selectAll("circle").data(demoData)
    let g = circlesGroup.enter().append("g")
        // Appending  circles to the plot
        g.append("circle")
        .attr("cx", d => xlinearScale(d.poverty))
        .attr("cy", d => ylinearScale(d.obesity))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5")
        .attr("opacity", "0.4")
        // It's not possible to append to the circles themselves, we have to make a separate layer to the plot
        g.append("text")
        .attr("x", d => xlinearScale(d.poverty))
        .attr("y", d => ylinearScale(d.obesity))
        .attr("dx", -8)
        .attr("dy", 5)
        .style("font-size", "12px")
        .style("fill", "white")
        .text((d) => d.abbr)
    // Tooltips
    var toolTip = d3.select("#scatter")
        .data(demoData)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text((d) => d.abbr)
        
    
    chartGroup.call(toolTip)
    
    // Y axis 
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("font-weight", "bold")
        .text("Obesity Level (%)");

    // X axis
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 20})`)
        .attr("class", "axisText")
        .style("font-weight", "bold")
        .text("In Poverty (%)");    
});