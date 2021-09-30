/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9;
const height = 500;
const margin = 100;

/* LOAD DATA */
d3.csv('../data/oil_data_zeihan.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    
    console.log("d.country:",data.map(d => d.Country))
    // yscale - categorical, activity
    const yScale = d3.scaleBand()
    .domain(data.map(d => d.Country))
    .range([height-margin, margin])
    .paddingInner(.2)
    
    
    console.log("d.usage.max:", d3.max(data, data=>data.Usage))
    // xscale - linear,count
    const xScale = d3.scaleLinear()
    .domain([0,d3.max(data, data=>data.Usage)])
    .range([0, width]) // visual variable
    .nice()

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    console.log("y:", d=>yScale(d.Country))
    console.log("width", d=>xScale(d.Usage))

    // bars
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", d=>xScale(d.Usage))
      .attr("height",d=>yScale.bandwidth())
      .attr("x", margin)
      .attr("y", d=>yScale(d.Country))

    // X-Axis tick
    svg.append("g")
    .attr("class", "x-axis")
    .style("transform", `translate(${margin}px,${height - margin*0.8}px)`)
    .style("font-size","15px")
    .call(d3.axisBottom(xScale)) //const xAxis = d3.axisBottom(xScale)

    // X-Axis label
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .style("transform", `translate(${margin*9}px,${height- margin*0.3}px)`)
    .text("Crude Oil Usage Estimate per day (1000 barrels, Year 2016)");

    //Y-Axis tick 
    svg.append("g")
    .attr("class", "y-axis")
    .style("transform", `translate(${margin}px,0px)`)
    .style("font-size","15px")
    .call(d3.axisLeft(yScale)) //const yAxis = d3.axisLeft(yScale)

    //Y-Axis Label
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("x", -height/2 )
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Country");
  })