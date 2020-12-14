let webURL = "https://jdeboi.com/Oogle/";
// let webURL = "http://localhost:8080/"

var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var isMobile = screen.width <= 700;

var url = window.location.href;
var startId = url.indexOf("?");
var endId = url.indexOf("&");
var roomID = "";
var cameFromID = "";
var startAngle = 0;
var zoomLevel = 12;

if (endId > -1) {
  roomID = url.substring(startId+6, endId);
  cameFromID = url.substring(endId+10, url.length);
}
else if (startId > -1) roomID = url.substring(startId+6, url.length);
else roomID = "kitchen"

// let clicked = {x:0, y:0};
let rot = {x:0, y:0};
// let lastRot = {x:0, y:0};
let mouseDown = false;
let currentMouse = {x:0, y:0};


/******* Add the create scene function ******/
var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);

  var loadingScreen = new CustomLoadingScreen("I'm loading!!");
  engine.loadingScreen = loadingScreen;
  engine.displayLoadingUI();
  scene.executeWhenReady(function() {
    engine.hideLoadingUI();
  })

  var camera = new BABYLON.UniversalCamera("FreeCamara",  new BABYLON.Vector3(0, 0, -10), scene);
  camera.inertia = 0;
  camera.angularSensibility = -600;
  if (isMobile) {
    console.log("CAM", camera)
    camera.inputs.attached.touch.touchAngularSensibility = -12000;
  }
  camera.attachControl(canvas, true);

  setRotation(camera);

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
      // clicked.x = pointerInfo.event.x;
      // clicked.y = pointerInfo.event.y;
      // lastRot.x = rot.x;
      // lastRot.y = rot.y;
      mouseDown = true;
      // console.log("POINTER DOWN");
      break;
      case BABYLON.PointerEventTypes.POINTERUP:
      mouseDown = false;
      // console.log("POINTER UP");
      break;
      case BABYLON.PointerEventTypes.POINTERMOVE:
      // console.log("POINTER MOVE");
      currentMouse.x = pointerInfo.event.x;
      currentMouse.y = pointerInfo.event.y;
      if (mouseDown) {
        dragged(camera, pointerInfo)
      }


      break;
      case BABYLON.PointerEventTypes.POINTERWHEEL:
      // console.log("POINTER WHEEL");
      break;
      case BABYLON.PointerEventTypes.POINTERPICK:
      // console.log("POINTERMath.PICK");
      break;
      case BABYLON.PointerEventTypes.POINTERTAP:
      goToNextRoom();
      break;
      case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
      // console.log("POINTER DOUBLE-TAP");
      break;
    }
  });

  var dome = new BABYLON.PhotoDome(
    "testdome",
    "./assets/panos/done/" + roomID + ".jpg",
    {
      resolution: 32,
      size: 1000
    },
    scene
  );
  dome.fovMultiplier = .1;



  var alpha = getCameraStartAngle();
  var offset = getCameraOffsetAngle();
  let ang = -alpha[0]-offset[0];
  console.log("ANG", alpha, ang);
  dome.rotate(BABYLON.Axis.Y, ang);

  // dome.rotate(BABYLON.Axis.X, -offset[1]);
  // dome.rotate(BABYLON.Axis.Z, -offset[2]);


  // var arrowManager = new BABYLON.SpriteManager("arrowManager", "assets/textures/arrow.png", 100, 100, scene);
  // var arrow = new BABYLON.Sprite("arrow", arrowManager);
  // arrow.
  return scene;
};
/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});


function dragged(camera, pointerInfo) {
  let width = document.getElementById("renderCanvas").width;
  let height =  document.getElementById("renderCanvas").height;
  let mouseX = pointerInfo.event.x;
  let mouseY = pointerInfo.event.y;
  // rot.y = map(mouseX - clicked.x, -width/2, width/2, Math.PI/4, -Math.PI/4) + lastRot.y;
  // rot.x = map(mouseY - clicked.y, -height/2, height/2, -Math.PI/4, Math.PI/4) + lastRot.x;
  // if (rot.x > Math.PI/2) rot.x = Math.PI/2;
  // else if (rot.x < -Math.PI/2) rot.x = -Math.PI/2;
  setRotation(camera);


}


function setDudeAngle() {
  let x = 0;
  let deg = rot.y/(Math.PI)*180 % 360;
  if (deg < 0) deg += 360;
  let rotNum = Math.floor(deg/22.5)-3;
  if (rotNum < 0) rotNum += 16;
  let y = rotNum * -60;
  let pos = x + "px " + y + "px";
  let dude = document.getElementById("dude");
  dude.style.backgroundPosition=pos;
}

function getDegrees(x) {
  return Math.floor(degrees(x)%360*100)/100;
}

function getCameraOffsetAngle() {
  console.log("ROOM", roomID)
  let point = getPointByID(roomID);
  let pictureAngle = point.start;
  return pictureAngle.map(function(x) { return x/180*Math.PI; });
}

function getCameraStartAngle() {
  // let point = getPointByID(roomID);
  if (cameFromID != "") {
    // let startAngle = getConnectionByID(cameFromID, roomID).bounding[0];

    let startAngle = getConnectionByID(roomID, cameFromID).cameFromAngle;
    return startAngle.map(function(x) { return x/180*Math.PI; });
  }
  return [0, 0];
}

function setRotation(camera) {
  // console.log(rot.y*180/Math.PI);
  // console.log(rot.x*180/Math.PI);
  rot.x = camera.rotation.x;
  rot.y = camera.rotation.y+getCameraStartAngle()[0];
  setDudeAngle();
}
