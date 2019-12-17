/**
 * Options passed to initLiveStream()
 * .env file contains secrets, it should not be committed.
 */

const {CLOUD_NAME, UPLOAD_PRESET} = require('../.env');

const options = {
    hlsTarget: true,
    fileTarget: true,
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET,
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
