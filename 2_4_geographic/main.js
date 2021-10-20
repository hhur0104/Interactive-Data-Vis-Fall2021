/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };


/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/stateCapitals.csv", d3.autoType),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, capitals, heats]) => {
  console.log(geojson, capitals)
  console.log(geojson.features)

  //geojson.features.map(d=>console.log(d.properties.STUSPS))
  
  // SPECIFY PROJECTION
  const projection = d3.geoAlbersUsa()
    .fitSize([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ], geojson)
  // console.log('projection :>> ', projection);

  // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath(projection)

  // APPEND GEOJSON PATH 
  const svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

  const states = svg.selectAll("path.states")
    .data(geojson.features, d => d.properties.STUSPS)
    .join("path")
    .attr("class", "states")
    .attr("d", d => pathGen(d))
    // .attr("fill", d => ["NY", "CA", "AR"]
    //   .includes(d.properties.STUSPS) 
    //     ? "pink" 
    //     : "blue")
    .attr("fill","white")
    .attr("stroke", "black")

  const colorScale = d3.scaleOrdinal()
  .domain(["R", "W", "B"])
  .range(["red","black","blue"]) 

  const colorScale_2 = d3.scaleSequential()
  .interpolator(d3.interpolateRdBu)
  .domain([d3.min(heats, d=>d.Change), 0, d3.max(heats, d=> d.Change)])
   //geojson.features.map(d=>console.log(d.properties.STUSPS))
  heats.map(d=>console.log(d.Change, colorScale_2(d.Change)))

  
  const color_3 =d3.scaleDiverging(heats.map(d => d.Change), 
  t => d3.interpolateRdBu(1 - t))

  // const color_3 = d3.scaleDiverging()
  //  .domain(heats.map(d => d.Change))
  //  .interpolateRdBu()
   //t => d3.interpolateRdBu(1 - t))
  
  /// draw points
  svg.selectAll("circle.point")
    .data(heats, d=> d.state)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d=>color_3(d.Change))
    //.attr("fill", d=>colorScale_2(d.Change))
    //.attr("fill", d=>colorScale(d.Col))
    .attr("transform", d=> {
      // use our projection to go from lat/long => x/y
      // ref: https://github.com/d3/d3-geo#_projection
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`
    })
  
  // APPEND DATA AS SHAPE

});