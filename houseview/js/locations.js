var points = [
  {"id":"porch1", "name": "Front Porch", "connected":
  [{"id": "foyer", "bounding": [175],}
], "dudePos": [53, -90]},
{
  "id":"foyer", "name": "Foyer",  "connected": [
    {"id": "porch1", "bounding": [5]},
    {"id": "living", "bounding": [173]}
  ], "dudePos": [-30, -50]},
  {"id":"living", "name": "Living Room", "connected": [
    {"id": "foyer", "bounding": [0]},
    {"id": "hall", "bounding": [-94]},
    {"id": "kitchen", "bounding": [211]}
  ], "dudePos": [-113, -53]},
  {"id":"hall", "name": "Hall", "connected": [
    {"id": "bedroom1", "bounding": [347]},
    {"id": "living", "bounding": [92]},
    {"id": "bedroom2", "bounding": [183]},
    {"id": "bathroom1", "bounding": [263]}
  ], "dudePos": [-113, -107]},
  {"id":"bathroom1", "name": "Bathroom","connected": [
    {"id": "hall", "bounding": [98]}
  ], "dudePos": [20, 200]},
  {"id":"bedroom1", "name": "Bedroom", "connected": [
    {"id": "hall", "bounding": [149]}
  ], "dudePos": [-24, -137]},
  {"id":"bedroom2", "name": "Bedroom Guest", "connected": [
    {"id": "hall", "bounding": [18.5]},
    {"id": "bathroom2", "bounding": [231]}
  ], "dudePos": [-240, -130]},
  {"id":"bathroom2", "name": "Bathroom Guest", "connected": [
    {"id": "bedroom2", "bounding": [0]}
  ], "dudePos": [-274, -160]},
  {"id":"kitchen", "name": "Kitchen","connected": [
    {"id": "porch2", "bounding": [191]},
    {"id": "living", "bounding": [35]}
  ], "dudePos": [-236, -53]},
  {"id":"porch2", "name": "Back Porch",  "connected": [
    {"id": "kitchen", "bounding": [18]}
  ], "dudePos": [-313, -87]}
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
