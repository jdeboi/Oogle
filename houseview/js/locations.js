var points = [
  {
    "id":"porch1",
    "name": "Front Porch",
    "connected":[{"id": "foyer", "bounding": [112], "cameFromAngle":[-71]}],
    "dudePos": [53, -90],
    "start":[210, 0, 10]
  },
  {
    "id":"foyer",
    "name": "Foyer",
    "connected": [
      {"id": "porch1", "bounding": [-29], "cameFromAngle":[205]},
      {"id": "living", "bounding": [-180], "cameFromAngle":[0]}
    ],
    "dudePos": [-30, -50],
    "start":[200, 0, 0]
  },

  {
    "id":"living",
    "name": "Living Room",
    "connected": [
      {"id": "foyer", "bounding": [13], "cameFromAngle":[-154]},
      {"id": "hall", "bounding": [-69], "cameFromAngle":[123, -27]},
      {"id": "kitchen", "bounding": [-203], "cameFromAngle":[7]}
    ],
    "dudePos": [-113, -53],
    "start":[185, 0, 0]
  },

  {
    "id":"hall",
    "name": "Hall",
    "connected": [
      {"id": "bedroom1", "bounding": [324], "cameFromAngle":[188]},
      {"id": "living", "bounding": [73], "cameFromAngle":[-86]},
      {"id": "bedroom2", "bounding": [188], "cameFromAngle":[-29]},
      {"id": "bathroom1", "bounding": [275], "cameFromAngle":[0]}
    ],
    "dudePos": [-113, -107],
    "start":[200, 0, 0]
  },

  {
    "id":"bathroom1",
    "name": "Bathroom",
    "connected": [
      {"id": "hall", "bounding": [25], "cameFromAngle":[-82]}
    ],
    "dudePos": [-114, -130],
    "start":[200, 0, 0]
  },

  {
    "id":"bedroom1",
    "name": "Bedroom",
    "connected": [
      {"id": "hall", "bounding": [149], "cameFromAngle":[0]}
    ],
    "dudePos": [-24, -137],
    "start":[-90, 0, 0]
  },

  {
    "id":"bedroom2",
    "name": "Bedroom Guest",
    "connected": [
      {"id": "hall", "bounding": [18.5], "cameFromAngle":[-150]},
      {"id": "bathroom2", "bounding": [231], "cameFromAngle":[0]}
    ],
    "dudePos": [-240, -130],
    "start":[200, 0, 0]
  },

  {
    "id":"bathroom2",
    "name": "Bathroom Guest",
    "connected": [
      {"id": "bedroom2", "bounding": [0], "cameFromAngle":[199]}
    ],
    "dudePos": [-274, -160],
    "start":[-90, 0, 0]
  },

  {
    "id":"kitchen",
    "name": "Kitchen",
    "connected": [
      {"id": "porch2", "bounding": [191], "cameFromAngle":[0]},
      {"id": "living", "bounding": [5], "cameFromAngle":[-155]}
    ],
    "dudePos": [-236, -53],
    "start":[200, 0, 0]
  },

  {
    "id":"porch2",
    "name": "Back Porch",
    "connected": [
      {"id": "kitchen", "bounding": [18], "cameFromAngle":[-138]}
    ],
    "dudePos": [-313, -87],
    "start":[200, 0, 0]
  }
];


function getNameFromID(id) {
  let index = points.findIndex(function(point) {
    return point.id == id;
  });

  if (index >= 0) return points[index].name;
  return null;
}

function getPointByID(id) {
  let index = points.findIndex(function(point) {
    return point.id == id;
  });

  if (index >= 0) return points[index];
  return null;
}

function getConnectionByID(pointID, connectionID) {
  let connections = getPointByID(pointID).connected;

  let index = connections.findIndex(function(connect) {
    return connect.id == connectionID;
  });

  if (index >= 0) return connections[index];
  return null;
}
