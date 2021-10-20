/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7;
 const height = window.innerHeight * 0.6;
 const r = 5;
 const margin = {top: 40, bottom:60, left:60, right:40};


/* LOAD DATA */
d3.csv("../data/oil_data_zeihan.csv", d3.autoType)
  .then(data => {
    console.log(data)
    console.log("x:", data.map(d => d.Usage))
    console.log("y:", data.map(d => d.Produce))

    /* SCALES */
    // xscale  - linear,count
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.Usage))])
      .range([margin.left, width - margin.right])
      .nice()

    // yscale - linear,count
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.Produce))])
      .range([height - margin.bottom, margin.top])
      .nice()

    //rScale - linear 
    const rScale = d3.scaleSqrt()
      .domain([0, d3.max(data.map(d => d.Import))]) 
      .range([r,8*r])
      .nice()
    
    console.log(rScale.domain())
    console.log(rScale.range())
    d => rScale(d.Import)
    // colorScale 
    // Import/Usage > 0.5 = blue, 
    // Import/Usage < 0.5 = red
    const colorScale = d3.scaleOrdinal()
      .domain(["Y", "N"])
      .range(["blue", "red"])
    
    
    /* HTML ELEMENTS */
    // svg
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      
    // X-axis scales
    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom*0.6})`)
      .call(xAxis);
    
    // X-Axis label
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "begin")
      .attr("x", width/3)
      .attr("y", height - margin.bottom * 0.05)
      .text("Crude Oil Usage Estimate per day (1000 barrels, Year 2016)");  
    
    // Y-axis scales
    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
    
    // Y-Axis label 
    svg.append("text")
     .attr("class", "y label")
     .attr("text-anchor", "begin")
     .attr("y", 6)
     .attr("x", -height/1.5 )
     .attr("dy", ".75em")
     .attr("transform", "rotate(-90)")
     .text("Crude Oil Produce Estimate per day");

    // circles
    var dots =  svg.selectAll("dots")
      .data(data)
      .enter()
      .append("g")
      .join("dots")
            
    dots.append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Usage))
      .attr("cy", d => yScale(d.Produce))
      .attr("r", d => rScale(d.Import))
      .style("fill", d=> colorScale(d.Importer));

    dots.append("text")
      .text(d => d.Country)
      .attr("x", d => xScale(d.Usage) )
      .attr("y", d => yScale(d.Produce) - rScale(d.Import));


    // Legends
    svg.append("text")
      .attr("class", "size info")
      .attr("text-anchor", "end")
      .attr("y", height - margin.bottom)
      .attr("x", width)
      .attr("dy", ".75em")
      .text("* Size of the Circle = Crude Oil Import per day");

    svg.append("text")
      .attr("class", "color info")
      .attr("text-anchor", "end")
      .attr("y", height - margin.bottom - 20)
      .attr("x", width)
      .attr("dy", ".75em")
      .text("* Blue = Import/Usage > 0.5 ");

    svg.append("text")
      .attr("class", "color info")
      .attr("text-anchor", "end")
      .attr("y", height - margin.bottom - 40)
      .attr("x", width)
      .attr("dy", ".75em")
      .text("* Red = Import/Usage < 0.5 ");

    
    // const dot = svg
    //   .selectAll("circle")
    //   .data(data, d => d.Country) // second argument is the unique key for that row
    //   .join("circle")
    //   .attr("cx", d => xScale(d.Usage))
    //   .attr("cy", d => yScale(d.Produce))
    //   .attr("r", d => rScale(d.Import))
    //   //.attr("fill", d => colorScale(d.Party))
  });
