let cnv;
let arrow;
let whiteArrow;
let arrowCanvas;
let onCanvas = true;


// let webURL = "https://jdeboi.com/Oogle/";
// let webURL = "http://localhost:8080/"
function preload() {
  arrow = loadImage("assets/textures/arrow.png");
  whiteArrow = loadImage("assets/images/arrow.png");
  arrowCanvas = createGraphics(200, 200);
  checkOnCanvas();
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('p5-canvas');
  imageMode(CENTER);
}

function draw() {
  clear();
  // background(255, 0, 0);
  if (onCanvas) drawMouse();
  compass();
  // displayNextRoom();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawMouse() {
  let deg = degrees(rot.y) % 360;
  if (deg < 0) {
    let d = deg;
    d = abs(deg);
    d %= 360;
    d = 360 - d;
    deg = d;
  }
  deg += getMouseDegrees();

  let angle = radians(getArrowAngle()-90);
  // if (deg <= 90) angle = map(deg, 0, 90, -PI/2, -PI);
  // else if (deg <= 180) angle = map(deg, 90, 180, 0, -PI/2);
  // else if (deg <= 270) angle = map(deg, 180, 270, -PI/2, -PI);
  // else angle = map(deg, 270, 360, 0, -PI/2);

  let  degreesx = degrees(rot.x);
  let  visYMin = map(degreesx, -45, 0, 0, height/2); // dunno why this is min
  // let visYMax = 400; //map(degreesx, 0, 45, height/2, height);


  arrowCanvas.clear();
  arrowCanvas.push();
  arrowCanvas.imageMode(CENTER);
  arrowCanvas.translate( arrowCanvas.width/2, arrowCanvas.height/2);
  arrowCanvas.rotate(angle);
  arrowCanvas.image(arrow, 0, 0);
  arrowCanvas.pop();


  if (currentMouse.y > visYMin) {
    let  diamW = map(currentMouse.y, visYMin, height, 50, 200);
    let  diamH = map(currentMouse.y, visYMin, height, 5, 200);
    // translate( currentMouse.x, currentMouse.y);
    // rotate(angle);
    image(arrowCanvas, currentMouse.x, currentMouse.y, diamW, diamH);
  }

  // imageMode(CENTER);
  // image(arrow, currentMouse.x, currentMouse.y);
}


function getMouseDegrees() {
  let mx = currentMouse.x - width/2;
  return map(mx, -width/2, width/2, -40, 40);
}

function compass() {
  fill("#343A40");
  noStroke();
  let w = 45;
  let t = 16;
  push();
  translate(windowWidth-50, height-50)
  ellipse(0, 0, w);
  image(whiteArrow, -14, 0, whiteArrow.width*.5, whiteArrow.height*.5);
  push();
  scale(-1, 1);
  image(whiteArrow, -14, 0, whiteArrow.width*.5, whiteArrow.height*.5);
  pop();
  rotate(rot.y-PI/2);
  // console.log(degrees(rot.y)%360);
  fill(255, 0, 0);
  triangle(-t/2.5, 0, t/2.5, 0, 0, -t);
  fill(255);
  triangle(-t/2.5, 0, t/2.5, 0, 0, t);
  pop();

  getMouseRotation();
}



function getMouseRotation() {
  var ratio = width/height;
  var angleWidth = map(ratio, 5.4, 1, 130, 45);
  // console.log(ratio, angleWidth, currentMouse.x);
  var mid = map(currentMouse.x, 0, width, -100, 100);
  var mouseAng = map(currentMouse.x, 0, width, -angleWidth/2, angleWidth/2)
  // console.log(degrees(rot.y)%360,  degrees(rot.y)%360 + mouseAng);
  return degrees(rot.y)%360 + mouseAng;
}

function displayNextRoom() {
  var nextRoom = getNextRoom();
  if (nextRoom != null) {
    fill(255);
    text(nextRoom, 100, 300);
  }
}

function goToNextRoom() {
  var nextRoom = getNextRoom();
  if (nextRoom != null) {
    window.location.href= webURL + "houseview/" + "?room=" + nextRoom + "&camefrom=" + roomID;
  }
}

function getNextRoom() {
  var nextRoom = null;
  var pt = getPointByID(roomID);
  if (pt != null) {
    var connections = pt.connected;
    nextRoom = getClosestRoom(degrees(rot.y), connections);
  }
  return nextRoom;
}

function getClosestRoomIndex(ang, connections) {
  var angDis = Infinity;
  var index = 0;
  for (var i = 0; i < connections.length; i++) {
    var directionDegree = connections[i].bounding[0];
    var dis = getDegreeDistance(ang, directionDegree)
    if (dis < angDis) {
      angDis = dis;
      index = i;
    }
  }
  return index;
}

function getClosestRoom(ang, connections) {
  let index = getClosestRoomIndex(ang, connections);
  return connections[index].id;
}

function getClosestRoomAngle(ang, connections) {
  let index = getClosestRoomIndex(ang, connections);
  return connections[index].bounding[0];
}

function getDegreeDistance(a, b) {
  var dis = abs((a-b)%360);
  if (dis > 180) dis = 360 - dis;
  return dis;
}


function degreeInBounds(x, w) {
  var d = degrees(rot.y)%360;
  if (d < 0) d += 360;
  if (x - w/2 < 0) {
    let lowBounds = (360-d) < abs(x - w/2);
    let highBounds = d < x + w/2;
    if (lowBounds || highBounds) return true;
    return false;
  }
  else if (x + w/2 > 360) {
    let lowBounds = d > x - w/2;
    let highBounds = (360+d) < x + w/2;
    if (lowBounds || highBounds) return true;
    return false;
  }
  else {
    return (d > x - w/2 && d < x + w/2);
  }
}

// function getDegreeDis(x) {
//   var d = degrees(rot.y)%360;
//   if (d < 0) d += 360;
//   var d1 = d - x; // 10 - 60 = -50  => 310
//   // 10 - 360 = -350 + 360 = 10
//   var d2 = d1 + 360;
//   if (abs(d1) < abs(d2)) return d1;
//   return d2;
// }

function getArrowAngle() {
  var nextRoom = null;
  var pt = getPointByID(roomID);
  var angArr = 0;
  if (pt != null) {
    var connections = pt.connected;
    angArr = getClosestRoomAngle(degrees(rot.y), connections);
  }
  // var mouseAng = getMouseRotation(); // degrees
  var arrowRot = angArr - degrees(rot.y) ;

  return arrowRot;
}

function checkOnCanvas() {
  var div = document.getElementById("houseViewer");
  div.onmouseover = function()   {
    onCanvas = false;
  };
  div.onmouseout = function()   {
    onCanvas = true;
  }
}
