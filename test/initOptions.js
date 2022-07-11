/**
 * Options passed to initLiveStream()
 */

const {STREAMING_SDK_CLOUD_NAME='demo-live', STREAMING_SDK_UPLOAD_PRESET='live-stream'} = process.env;

const options = {
    hlsTarget: true,
    fileTarget: true,
  cloudName: STREAMING_SDK_CLOUD_NAME,
  uploadPreset: STREAMING_SDK_UPLOAD_PRESET,
  //debug: 'all',
  events: {
    start: function (args) {
      //self.setLiveStreamStatus('start');
      console.log('start');
    },
    stop: function (args) {
      //self.setLiveStreamStatus('stop');
      console.log('stop');
    },
    error: function (error) {
      console.log('error', error);
    },
    local_stream: function (stream) {
      //attaching the stream to a video view:
      //liveStream.attach(self.videoRef, stream);
      console.log('stream');
    }
  }
};

module.exports = {
  options
};
