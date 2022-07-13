const {listDevices, initLiveStream, attachCamera, detachCamera, getStream} = cloudinaryJsStreaming;
const CLOUD_NAME = 'demo-live';
const UPLOAD_PRESET = 'live-stream';

let liveStream, publicId, url;

function setText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function setStatus(status) {
  setText("status", status);
}

function toggleButton(id, enabled) {
  document.getElementById(id).disabled = !enabled;
}

function toggleBtns(init = false, start = false, stop = false) {
  toggleButton("initbtn", init);
  toggleButton("startbtn", start);
  toggleButton("stopbtn", stop);
}

function setUrl(url) {
  const fileUrl = url + '.mp4';
  const streamUrl = url + '.m3u8';

  const file_link = document.getElementById('file_url');
  const stream_link = document.getElementById('stream_url');

  file_link.href = fileUrl;
  file_link.innerText = fileUrl;
  stream_link.href = streamUrl;
  stream_link.innerText = streamUrl;
}

function view(){
  const videoElement = document.getElementById("video");
  const device = { deviceId: getSelectedCamera() };

  attachCamera(videoElement, device).then(c=>{
    console.log(c);
  });
}

function hide(){
  detachCamera(document.getElementById("video")).then(c=>{
    console.log(c);
  })
}

function start() {
  setStatus("starting...");
  toggleBtns();
  liveStream.start(publicId);
}

function stop() {
  setStatus("stopping...");
  toggleBtns();
  liveStream.stop();
}

// call initLiveStream with the configuration parameters:
async function initialize() {
  setStatus("initializing...");
  toggleBtns();
  const cameraStream = await getSelectedCameraStream();

  initLiveStream({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    stream: cameraStream,
    debug: "all",
    hlsTarget: true,
    fileTarget: true,
    events: {
      start: function (args) {
        setStatus("started");
        document.getElementById("video").className = "video recording";
        toggleBtns(false, false, true);
      },
      stop: function (args) {
        setStatus("stopped");
        document.getElementById("video").className = "video";
        toggleBtns(true, false, false);
      },
      error: function (error) {
        setStatus("error: " + error);
        toggleBtns(true, false, false);
      },
      local_stream: function (stream) {
        setStatus("local stream");
        // Attach the stream to a video element:
        liveStream.attach(document.getElementById("video"), stream);
      }
    }
  }).then(result => {
    // keep handle to instance to start/stop streaming
    liveStream = result;

    // Extract public id and url from result (publish the url for people to watch the stream):
    publicId = result.response.public_id;
    url = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}`;

    setStatus("initialized");
    setText("publicid", publicId);
    setUrl(url);

    toggleBtns(false, true, false);
  }).catch(e => {
    setStatus("" + e);
  });
}

function getSelectedCamera(){
  return document.getElementById('devices').value;
}

function getSelectedCameraStream(){
  const deviceId = getSelectedCamera();
  if (deviceId) {
    return getStream({audio: true, video: {deviceId}});
  }

  return getStream();
}

/**
 * Get user permission to access devices
 * @returns {Promise<MediaStream>}
 */
function getUserMediaPermission(){
  return navigator.mediaDevices.getUserMedia({video: true, audio: true});
}

function addCameraOption(device){
  if (device.kind.includes('video')) {
    const devicesDropDown = document.getElementById('devices');
    const opt = document.createElement('option');
    opt.value = device.deviceId;
    opt.innerHTML = device.label || 'unknown';
    devicesDropDown.appendChild(opt);
  }
}

/**
 * Fill camera <select> with video devices
 */
function fillCameraDropdown() {
  getUserMediaPermission().then(() => {
    listDevices().then((devices) => devices.forEach(addCameraOption));
  }).catch(() => {
    console.error('Could not get user media devices.');
  });
}

// When DOM loaded, Fill camera <select> with video devices
document.addEventListener("DOMContentLoaded", fillCameraDropdown);
