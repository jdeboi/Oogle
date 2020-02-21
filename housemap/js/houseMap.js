let webURL = "https://jdeboi.com/Oogle/"
let containerWidth = +d3.select('.mapContainer').style('width').slice(0, -2)
let containerHeight = +d3.select('.mapContainer').style('height').slice(0, -2)
// let currentAngle = 0;
// let startDragMouse = [];
let mapAngle = 0;
let zoomLevel = 1;
let iconS = 30;
let dudeIsClicked = false;
let mouseCoords = [];
let streetOver = false;
let directionsSet = false;

let startLocSelected = false;
let endLocSelected = false;

let globalDirections = {};

let zoom = d3.zoom()
.scaleExtent([.7, 3.2])
.on("zoom", zoomed);

let svg = d3.select(".mapContainer svg");
svg.call(zoom);
svg.on("mousemove", function(){
  mouseCoords = d3.mouse(this);
  if (dudeIsClicked) {
    d3.select("g#dudeImg").attr("class", "visible")
    .attr("pointer-events", "none");
    dudeImg.attr("x", mouseCoords[0]-25);
    dudeImg.attr("y", mouseCoords[1]-45);
  }
});

var points = [
  {"id":"porch1", "name": "Front Porch", "icon": "porch", "x": 40, "y":298, "on": false, "connected": ["Foyer"]},
  {"id":"foyer", "name": "Foyer", "icon": "foyer", "x": 303.5, "y":162, "on": false, "connected": ["Front Porch", "Living Room"]},
  {"id":"living", "name": "Living Room", "icon": "living", "x": 595, "y":162, "on": false, "connected": ["Foyer", "Hall", "Kitchen"]},
  {"id":"hall", "name": "Hall", "icon": "hall", "x": 595, "y":350, "on": false, "connected": ["Bedroom", "Bathroom", "Bathroom Guest", "Bedroom Guest"]},
  {"id":"bathroom1", "name": "Bathroom", "icon":"bathroom", "x": 595, "y":470, "on": false, "connected": ["Hall"]},
  {"id":"bedroom1", "name": "Bedroom", "icon":"bedroom", "x": 293, "y":452, "on": false, "connected": ["Hall"]},
  {"id":"bedroom2", "name": "Bedroom Guest", "icon":"bedroom", "x": 1009, "y":408, "on": false, "connected": ["Hall", "Bathroom Guest"]},
  {"id":"bathroom2", "name": "Bathroom Guest", "icon":"bathroom", "x": 1115, "y":532, "on": false, "connected": ["Bedroom Guest"]},
  {"id":"kitchen", "name": "Kitchen", "icon":"kitchen", "x": 1008, "y":183, "on": false, "connected": ["Living Room", "Back Porch"]},
  {"id":"porch2", "name": "Back Porch", "icon": "porch", "x": 1257, "y":293, "on": false, "connected": ["Kitchen"]}
];

// let satellite =
// svg.append("g")
// .attr("id", "satellite")
// .attr("pointer-events", "none");
//
// satellite
// .append("image")
// .attr("pointer-events", "none")
// .attr("xlink:href", "media/satellite.png")
// .attr("x", -2750)
// .attr("y", -1150)
// .attr("width", 6400)
// .attr("height", 2800);



let defs = svg.append("defs").attr("id", "imgdefs")
let dudePattern = defs.append("pattern")
.attr("id", "dudePattern")
.attr("height", 1)
.attr("width", 1)
.attr("x", "0")
.attr("y", "0")
.append("image")
.attr("xlink:href", "housemap/media/dude.png")
.attr("x", 0)
.attr("y", 0)
.attr("width", 56)
.attr("height", 240);

let dudeImg = svg.append("g")
.attr("id", "dudeImg")
.attr("class", "hidden")
.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 60)
.attr("height", 60)
.attr("fill", "url(#dudePattern)")



// svg.call(d3.drag()
// .on("start", dragstarted)
// .on("drag", dragged)
// .on("end", dragended));


let mapGroup = svg.select("g#map")

function getPointByID(id) {
  let index = points.findIndex(function(point) {
    return point.id == id;
  });

  if (index >= 0) return points[index];
  return null;
}


function getPointByName(name) {
  let index = points.findIndex(function(point) {
    return point.name == name;
  });

  if (index >= 0) return points[index];
  return null;
}

let g = new Graph();
// adding vertices
for (let i = 0; i < points.length; i++) {
  g.addNode(points[i].id);
}
// adding edges
for (let i = 0; i < points.length; i++) {
  let connections = points[i].connected;
  for (let j = 0; j < connections.length; j++) {
    var connection = getPointByName(connections[j]);
    let dis = dist(points[i].x, points[i].y, connection.x, connection.y);
    g.addEdge(points[i].id, connection.id, dis);
  }
}


//
function checkDirections() {
  let start = getSingleMatchIndex(startLocDiv.property("value"));
  let end = getSingleMatchIndex(endLocDiv.property("value"));
  if (start >= 0 && end >= 0) {
    clearDirectionList();
    clearLocationList();
    directionsSet = true;
    // d3.select("#listDirections").attr("class", "");
    d3.select("#directions").style("display", "block")
    // d3.select("#directionsSummary").style("visibility", "visible")
    displayDirections(points[start].id, points[end].id);
  }
}

function clearDirectionList() {
  globalDirections = {};
  directionsSet = false;
  resetYellowPaths();
  d3.select("#listDirections").html("");
  // d3.select("#listDirections").style("visibility", "hidden")
  d3.select("#directionsSummary").html("");
  // d3.select("#directionsSummary").style("visibility", "hidden")
  d3.select("#directions").style("display", "none")
  // .attr("class", (d) => {
  //   let c = "listItemD";
  //   return c += "";
  // })
}

function displayRoutes(steps) {
  for (let i = 0; i < steps.length-1; i++) {
    setRouteColors(steps[i].id, steps[i+1].id);

  }

}

function displayDirections(str1, str2) {
  // let p1 = points.find(x => x.name === str1).name;
  let directionList = d3.select("#listDirections");

  let directions = g.findPathWithDijkstra(str1, str2);
  globalDirections = directions;
  displayRoutes(globalDirections.steps);
  // leave ____ heading ____
  // x feet
  // ----


  var summary = d3.select("#directionsSummary")
  .attr("class", "listItemD")
  .append("div")
  .attr("class", "listItemPodD");

  summary
  .append("div")
  .attr("class", "summaryDis")
  .append("span")
  .attr("class", "directionsTime")
  .text(() => directions.totalTime + " seconds")
  .append("span")
  .attr("class", "directionsDistance")
  .text(() => " (" + directions.totalDistance + " ft)");

  summary
  .append("div")
  .attr("class", "directionsDeets")
  .text("Fastest route")
  .append("div")
  .text("the usual mess")
  .append("hr");

  directionList.selectAll("div")
  .data(directions.steps.slice(0, directions.steps.length-1))
  .enter()
  .append("div")
  .attr("class", "listItemD")
  .append("div")
  .attr("class", "listItemPodD")
  .append("div")
  .attr("class","row")
  .append("div")
  .attr("class", "col-1")
  .append("img")
  .attr("src", (d, i) => "housemap/media/icons/" + getStepDirection(globalDirections.steps, i) + ".png")
  .attr("width", 18)
  .attr("height", 18);

  directionList.selectAll("div.listItemPodD .row")
  .append("div")
  .attr("class", "col-11")
  .text((d, i) => getVerbalDirection(globalDirections.steps, i))
  .append("div")
  .attr("class", "directionsDis")
  .text((d) => d.feet + " ft")
  .append("hr");

  let getLast = getPointByID(globalDirections.steps[globalDirections.steps.length-1].id).name;
  let lastBit = directionList
  .append("div")
  .attr("class", "listItemD");

  lastBit
  .append("div")
  .attr("class", "finalD listItemPodD")
  .text(getLast);

  lastBit
  .append("div")
  .attr("class", "directionsDeets listItemPodD")
  .text("a spot in your house...");
}


for (let i = 0; i < 10; i ++) {
  labels[i].x = points[i].x;
  labels[i].y = points[i].y+3;
}

let iconsGroup = svg.append('g')
.attr("id", "icons");
// .attr("pointer-events", "none");

iconsGroup
.selectAll('.icon')
.data(points)
.enter()
.append('image')
.attr("xlink:href", (d) => "housemap/media/icons/" + d.icon + ".svg" )
.attr("x", (d) => d.x-iconS/2)
.attr("y", (d) => d.y-iconS)
.attr("width", iconS)
.attr("height", iconS)
.on("mouseover", function(d) {
  d.on = true;
  if (dudeIsClicked) {
    highlightedDudePaths();
  }
})
.on("mouseout", function(d) {
  d.on = false;
  resetYellowPaths();
});

function onIcon() {
  let on = false;
  iconsGroup
  .selectAll('image')
  .each(function(d) {
    if (d.on) on = true;
  });
  return on;
}

let wordsGroup = svg.append('g')
.attr("id", "words")
.attr("pointer-events", "none");

wordsGroup
.selectAll('.word')
.data(labels)
.enter()
.append('text')
.attr("class", (d, i) => 'word'+i)
.attr("class", (d) => {
  if (zoomLevel < 1) {
    if (d.sc > 1) return "visible";
    return "hidden"
  }
  else {
    if (d.sc == 1) return "visible";
    return "hidden";
  }
})
.attr("x", (d) => d.x)
.attr("y", (d) => d.y+20)
.attr("dy", 0)
.text((d) => {
  if (d.sc == 1) return d.txt.toUpperCase();
  return d.txt;
})
.attr("font-family", (d) => {
  return "Roboto";
})
.attr("letter-spacing", (d) => {
  if (d.sc == 1) return ".2rem";
  return "normal"
})
.attr("font-size", (d) => {
  if (d.sc == 1) return "18px";
  // else if (d.sc == 2) return "18px";
  return "14px";
})
.attr("fill", "gray")
.style("text-anchor", "middle")
.style("text-align", "center")
.call(wrap, 200); // wrap the text in <= 30 pixels

wordsGroup
.selectAll("text")
.each(function(d, i) {
  let bound = d3.select(this).node().getBBox();
  let w = bound.width/2;
  let h = bound.height/2;
  labels[i].bw = w;
  labels[i].bh = h;
})

wordsGroup
.selectAll("text")
.data(labels)
.enter();

function wrap(text, width) {
  text.each(function () {
    let text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems
    x = text.attr("x"),
    y = text.attr("y"),
    dy = 0, //parseFloat(text.attr("dy")),
    tspan = text.text(null)
    .append("tspan")
    .attr("x", x)
    .attr("y", y)
    .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", ++lineNumber * lineHeight + dy + "em")
        .text(word);
      }
    }
  });
}

function resetYellowPaths() {
  d3.selectAll("g#paths polygon")
  .style('fill', d3.rgb(254,241,160))
  .style('stroke', d3.rgb(243, 201, 89))
  .style('stroke-width', 3);
  if (directionsSet) {
    displayRoutes(globalDirections.steps);
  }
}

function highlightedDudePaths() {
  d3.selectAll("g#paths polygon")
  .style('fill', d3.rgb(151,221,251))
  .style('stroke-width', 0);

  // darker b = d3.rgb(151,221,251)
  // light b = d3.rgb(70, 143, 170)

  if (directionsSet) {
    displayRoutes(globalDirections.steps);
  }
}

function initState(mapAngle) {
  zoomLevel = 1;
  mapGroup.attr("transform", getMapRotate(mapAngle));
  wordsGroup.attr("transform", getMapRotate(mapAngle));
  iconsGroup.attr("transform", getMapRotate(mapAngle));

  let dx = 0;
  let dy = 0;

  iconsGroup
  .selectAll('image')
  .attr("transform", (d) => {
    let offsetX = d.x;
    let offsetY = d.y;
    let t = "translate("+offsetX+ ","+offsetY+") ";
    t += "rotate(" + (-mapAngle) + ", 0, 0)"
    t += "scale("+ (1/zoomLevel) + ") ";
    t += "translate(-"+offsetX+",-"+offsetY+ ") " ;

    return t;
  });

  wordsGroup
  .selectAll('text')
  .attr("transform", (d, i) => {
    let offsetX = d.x;
    let offsetY = d.y;
    // console.log(d.txt, d.bw)
    let t = "translate("+offsetX+ ","+offsetY+") ";
    t += "rotate(" + (-mapAngle) + ", 0, 0)"
    t += "scale("+ (1/zoomLevel) + ") ";
    t += "translate(-"+offsetX+",-"+offsetY+ ")";
    return t;
  });
}

function zoomed() {
  setTransform(d3.event.transform.x, d3.event.transform.y, d3.event.transform.k, mapAngle);
}

d3.selectAll('button#zoomIn').on('click', function() {
  zoom.scaleBy(svg.transition().duration(750), 1.3);
});

d3.select('button#zoomOut').on('click', function() {
  zoom.scaleBy(svg.transition().duration(750), 1 / 1.3);
});


function setTransform(x, y, k, angle) {
  let transform = `translate(${x}, ${y}) scale(${k})`;

  // satellite.attr("transform", transform + " " + getMapRotate(angle));
  mapGroup.attr("transform", transform + " " + getMapRotate(angle));
  wordsGroup.attr("transform", transform + " " + getMapRotate(angle));
  iconsGroup.attr("transform", transform + " " + getMapRotate(angle));

  zoomLevel = k;
  let dx = x;
  let dy = y;

  iconsGroup
  .selectAll('image')
  .attr("transform", (d) => {
    let offsetX = d.x;
    let offsetY = d.y;
    let t = "translate("+offsetX+ ","+offsetY+") ";
    t += "rotate(" + (-mapAngle) + ", 0, 0)"
    t += "scale("+ (1/zoomLevel) + ") ";
    t += "translate(-"+offsetX+",-"+offsetY+ ") " ;

    return t;
  });

  wordsGroup
  .selectAll('text')
  .attr("transform", (d, i) => {
    let offsetX = d.x;
    let offsetY = d.y;
    // console.log(d.txt, d.bw)
    let t = "translate("+offsetX+ ","+offsetY+") ";
    t += "rotate(" + (-mapAngle) + ", 0, 0)"
    t += "scale("+ (1/zoomLevel) + ") ";
    t += "translate(-"+offsetX+",-"+offsetY+ ")";
    return t;
  })
  .attr("class", (d) => {
    // zoom goes up as zooms in
    if (zoomLevel > 2) {
      if (d.sc > 1) return "visible";
      return "hidden"
    }
    else if (zoomLevel > 1.5) {
      if (d.sc > 1 && d.sc < 4) return "visible";
      return "hidden"
    }
    else if (zoomLevel > 1) {
      if (d.sc < 3) return "visible";
      return "hidden"
    }
    else {
      if (d.sc == 1) return "visible";
      return "hidden";
    }
  });

  changeLegend();
}

function changeLegend() {
  //
  // width of house = 50 ft
  // width of screen = 1650 pixels
  // width bar = 100 pixels
  //  100 * (1/zoomLevel) * (50/1650) = 3 ft @ zoomlevel 1
  let newLen = 1/zoomLevel * 3;
  let fivesLen =  Math.round(newLen *10 / 5) * 5 /10;
  let newBar = fivesLen * (1650/50) * zoomLevel;
  d3.select("#legendNum").html(fivesLen + "ft")
  d3.select("#legendBar").style("width", newBar +"px")
}


//////////////////////////
// ROTATION
function dragstarted() {
  startDragMouse = d3.mouse(this);
  // console.log(startDragMouse)
}

function dragged() {
  let dtheta = getDTheta(this);
  rotateMap(currentAngle + dtheta);
  rotateIcons(currentAngle + dtheta);
}

function dragended() {
  currentAngle += getDTheta(this);
  rotateMap(currentAngle);
  rotateIcons(currentAngle);
}

function getDTheta(inst) {
  let d0 = [containerWidth/2, containerHeight/2];
  let d1 = startDragMouse;
  let thetaStart = Math.atan2(d1[1] - d0[1], d1[0] - d0[0]);
  d1 = d3.mouse(inst);
  let thetaEnd = Math.atan2(d1[1] - d0[1], d1[0] - d0[0]);
  let dTheta = thetaEnd - thetaStart;
  return dTheta;
}

// rotateMap(Math.PI/3)

function rotateMap(angDeg) {
  let transform = mapGroup.attr('transform');
  mapGroup.attr('transform',function(){
    // let me = svg.node()
    // let x1 = me.getBBox().x + me.getBBox().width/2;//the center x about which you want to rotate
    // let y1 = me.getBBox().y + me.getBBox().height/2;//the center y about which you want to rotate
    let x1 = containerWidth/2;
    let y1 = containerHeight/2;
    // let angDeg = ang * 180 / Math.PI;
    return transform +` rotate(${angDeg}, ${x1}, ${y1})`;//rotate 180 degrees about x and y
  });
}

function getMapRotate(angDeg) {
  let x1 = containerWidth/2;
  let y1 = containerHeight/2;
  return `rotate(${angDeg}, ${x1}, ${y1})`;
}

function rotateIcons(angDeg) {
  // let angDeg = ang * 180 / Math.PI;
  let transform = iconsGroup.attr('transform');
  iconsGroup.attr('transform',function(){
    // let me = svg.node()
    // let x1 = me.getBBox().x + me.getBBox().width/2;//the center x about which you want to rotate
    // let y1 = me.getBBox().y + me.getBBox().height/2;//the center y about which you want to rotate
    let x1 = containerWidth/2;
    let y1 = containerHeight/2;
    return transform + ` rotate(${angDeg}, ${x1}, ${y1})`;//rotate 180 degrees about x and y
  });

  iconsGroup.selectAll("image")
  .attr('transform', (d) => {
    return transform + ` rotate(${-angDeg}, ${d.x+iconS/2}, ${d.y+iconS})`;
  })
}

function getRotateWords(angDeg) {
  // let angDeg = ang * 180 / Math.PI;
  let transform = wordsGroup.attr('transform');
  wordsGroup.attr('transform',function(){
    // let me = svg.node()
    // let x1 = me.getBBox().x + me.getBBox().width/2;//the center x about which you want to rotate
    // let y1 = me.getBBox().y + me.getBBox().height/2;//the center y about which you want to rotate
    let x1 = containerWidth/2;
    let y1 = containerHeight/2;
    return transform + ` rotate(${angDeg}, ${x1}, ${y1})`;//rotate 180 degrees about x and y
  });

  wordsGroup.selectAll("text")
  .attr('transform', (d) => {
    return transform + ` rotate(${-angDeg}, ${d.x+iconS/2}, ${d.y+iconS})`;
  })
}


let onRoute = false;
let routes = d3.select("g#paths").selectAll("polygon");
routes
.attr("pointer-events", "all")
.on("mouseover", function(d) {
  onRoute = true;
  if (dudeIsClicked) {
    highlightedDudePaths();
  }
})
.on("mouseout", function(d) {
  onRoute = false;
  resetYellowPaths();
});

d3.select("#dude")
.on('mouseover', function(d){
  d3.select(this).style("background-position", "-4px -189px")
})
.on('mouseout', function(d){
  let dude = d3.select(this);
  console.log(dudeIsClicked);
  if (dudeIsClicked) dude.style("background-position", "-4px 400px");
  else dude.style("background-position", "-4px -9px");
})

document.onmouseup = release;
function dudeClicked() {
  dudeIsClicked = true;
}

function release() {
  dudeIsClicked = false;

  let d = d3.select("g#dudeImg").attr("class", "hidden");



  d3.select("#dude").style("background-position", "-4px -9px");

  if (onRoute || onIcon()) {

    getNearestPoint();
  }
}

function getNearestPoint() {

  let ind = -1;
  let dis = Infinity;
  iconsGroup.selectAll("image")
  .each(function(d, i) {
    // console.log(m)
    let dd = dist(mouseCoords[0], mouseCoords[1], points[i].x, points[i].y);
    if (dd < dis) {
      dis = dd;
      ind = i;
    }
  });

  window.location.href = webURL + "houseview/?room=" + points[ind].id;
}

function dist(x0, y0, x1, y1) {
  let dx = x1 - x0,
  dy = y1 - y0;
  return dx * dx + dy * dy;
}

let startLocDiv = d3.select("#startLoc")
.on("click", function() {
  startLocSelected = true;
  endLocSelected = false;
  let typed = d3.select(this).node().value;
  clearDirectionList();
  updateList(typed);
})
.on("input", function() {
  let typed = d3.select(this).node().value;
  updateList(typed);
})
.on("blur", () => {
  let typed = startLocDiv.node().value;
  setStartLoc(typed);
  checkDirections();
});

d3.select("body")
.on("keyup", function() {
  if(d3.event.key == "Tab") {
    clearLocationList();
  }
  else if (d3.event.key == "Enter") {
    if (startLocSelected) {
      clearLocationList();
      checkDirections();
      document.getElementById("startLoc").blur();
    }
    else if (endLocSelected) {
      clearLocationList();
      checkDirections();
      document.getElementById("endLoc").blur();
    }

  }
});

let endLocDiv = d3.select("#endLoc")
.on("click", function() {
  endLocSelected = true;
  startLocSelected = false;
  let typed = d3.select(this).node().value;
  clearDirectionList();
  updateList(typed);
})
.on("input", function() {
  let typed = d3.select(this).node().value;
  updateList(typed);
})
.on("blur", () => {
  let typed = endLocDiv.node().value;
  setEndLoc(typed);
  checkDirections();
});

function getSingleMatchIndex(typed) {
  let index = -1;
  let num = 0;
  for (let i = 0; i < points.length; i++) {
    let regExact = new RegExp(`^${typed}$`, 'i');
    if (regExact.test(points[i].name))  {
      return i;
    }
    let reg = new RegExp(`^${typed}`, 'i');
    if (reg.test(points[i].name)) {
      index = i;
      num++;
    }
  }
  if (num == 1) {
    return index;
  }
  else return -1;
}

function setStartLoc(typed) {
  let index = getSingleMatchIndex(typed);
  if (index >= 0) {
    startLocDiv.property("value", points[index].name);
  }
}

function setEndLoc(typed) {
  let index = getSingleMatchIndex(typed);
  if (index >= 0) {
    endLocDiv.property("value", points[index].name);
  }
}




let locationList = d3.select("#listLocations");
locationList.selectAll("div")
.data(points)
.enter()
.append("div")
.attr("class", "listItemL hidden")
.append("div")
.attr("class", "listItemPodL")
.on("mousedown", (d) => {
  if (startLocSelected) {
    startLocDiv.property("value",d.name);
    clearLocationList();
    checkDirections();
  }
  else if (endLocSelected) {
    endLocDiv.property("value",d.name);
    clearLocationList();
    checkDirections();
  }
})

locationList.selectAll("div.listItemPodL")
.append("img")
.attr("src", (d) => "housemap/media/icons/" + d.icon + ".svg")
.attr("width", iconS)
.attr("height", iconS);

locationList.selectAll("div.listItemPodL")
.append("span")
.text((d) => d.name);

function updateList(word) {
  locationList.selectAll("div.listItemL")
  .attr("class", (d) => {
    let c = "listItemL ";
    let reg = new RegExp(`^${word}`, 'i');
    if (reg.test(d.name)) return c += "visible";
    return c += "hidden";
  })
}

function clearLocationList() {
  locationList.selectAll("div.listItemL")
  .attr("class", (d) => {
    let c = "listItemL ";
    return c += "hidden";
  })
}

d3.select("#swapArrows")
.on("click", () => {
  let a = startLocDiv.property("value");
  let b = endLocDiv.property("value");
  endLocDiv.property("value", a);
  startLocDiv.property("value", b);
  clearLocationList();
  checkDirections();
})


function setRouteColors(start, end) {
  let path1 = start + "_" + end;
  let path2 = end + "_" + start;
  var pathIDs = ["porch1_foyer", "foyer_living", "living_kitchen", "kitchen_porch2", "living_hall", "hall_bedroom1", "hall_bathroom1", "hall_bedroom2", "bedroom2_bathroom2"];

  let path = path1;
  if (pathIDs.indexOf(path2) > -1) path = path2;

  var polygon = d3.select("g#paths").select("polygon#" + path);
  polygon.style("fill", d3.rgb(102,157,246)).style("stroke", d3.rgb(102,157,246))

  // if(Array.isArray(polygon._groups[0]) && polygon._groups[0].length) {
  //   return null;
  // }
}

function objectEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

// foyer living "Leave the _0__ and head towards ____"
// foyer living bathroom
// "Leave the _0__ and head towards _1__"
// "(turn right and walk towards the)" ____"
function getVerbalDirection(steps, index) {
  if (index == 0) {
    let start = getPointByID(steps[0].id).name;
    let d1 = getPointByID(steps[1].id).name;
    return "Leave the " +start + " and walk to the " + d1;
  }
  else if (index < steps.length-1) {
    let start = getPointByID(steps[index].id).name;
    let end = getPointByID(steps[index+1].id).name;
    let dir = getStepDirection(steps, index);
    if (dir == "right" || dir == "left") return `Turn ${dir} towards the ${end}`;
    else if (dir == "straight") return "Go straight towards the " + end;
  }
  return "";

}

function getStepDirection(steps, index) {
  if (index == 0) return "straight";
  else if (index == steps.length-1) return "";

  else {
    let p0 = getPointByID(steps[index-1].id);
    let p1 = getPointByID(steps[index].id);
    let p2 = getPointByID(steps[index+1].id);
    if (p0 && p1 && p2) {
      let ang = find_angle(p0, p1, p2)*180/Math.PI;
      let variance = 30;
      if (ang > 90-variance && ang < 90+variance) return "right";
      else if (ang > -90 - variance && ang < -90 + variance) return "left";
      return "straight";
    }
    return "";
  }
}

// c is center point
function find_angle(A,C,B) {
  let v1x = B.x - C.x;
  let v1y = B.y - C.y;
  let v2x = A.x - C.x;
  let v2y = A.y - C.y;
  return Math.atan2(v1x, v1y) - Math.atan2(v2x, v2y);
}
