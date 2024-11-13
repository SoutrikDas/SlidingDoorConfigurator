// sketchfab.js
var iframe = document.getElementById("api-frame");
var uid = "a294a9c3a7a348259a240c89659b4388"; // Replace with your model's UID
var api;
var version = "1.12.1";
var client = new window.Sketchfab(version, iframe);

function onSuccess(apiInstance) {
  api = apiInstance;
  api.start();
  api.addEventListener("viewerready", function () {
    console.log("Viewer is ready");
    onModelLoaded(api);
  });
}

function onError() {
  console.error("Viewer initialization failed");
}

var client = new Sketchfab(iframe);
client.init(uid, {
  success: onSuccess,
  error: onError,
  autostart: 1,
  preload: 1,
  animation_autoplay: 0,
  annotation: 0,
  ui_controls: 0,
  ui_general_controls: 0,
  ui_infos: 0,
  ui_stop: 0,
  ui_watermark: 0,
  ui_ar: 0,
  ui_help: 0,
  ui_settings: 0,
  ui_vr: 0,
  ui_fullscreen: 0,
  transparent: 1,
  ui_color: "222222",
});

function onModelLoaded(api) {
  console.log("Model has been loaded");
  // You can perform any model-specific logic here (like retrieving node data)
  // Optionally log parts or handle other viewer events
}
