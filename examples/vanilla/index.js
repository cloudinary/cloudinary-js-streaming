const {initLiveStream, attachCamera, detachCamera} = cloudinaryJsStreaming;
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
  attachCamera(document.getElementById("video")).then(c=>{
    console.log(c);
  })
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
function initialize() {
  setStatus("initializing...");
  toggleBtns();

  initLiveStream({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
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
    url = 'https://res.cloudinary.com/demo-live/video/upload/' + publicId;

    setStatus("initialized");
    setText("publicid", publicId);
    setUrl(url);

    toggleBtns(false, true, false);
  });
}
