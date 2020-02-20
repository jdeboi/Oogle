function CustomLoadingScreen( /* variables needed, for example:*/ text) {
  //init the loader
  this.loadingUIText = text;
}

CustomLoadingScreen.prototype.displayLoadingUI = function() {
  // alert(this.loadingUIText);
};

CustomLoadingScreen.prototype.hideLoadingUI = function() {
  // alert("Loaded!");
  let point = getPointByID(roomID);
  document.getElementById("roomID").innerHTML = point.name;

  let pos = point.dudePos[0] + "px " + point.dudePos[1] + "px";
  let mappos = document.getElementById("houseViewer").style.backgroundPosition = pos;

  let loading = document.getElementById("loadingScreen");
  loading.style.visibility="hidden";
  loading.style.display="none";
};
