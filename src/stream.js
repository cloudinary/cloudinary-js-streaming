//import Janus from "./janus";
import 'whatwg-fetch'

//Use an external janus.
import { Janus } from'janus-gateway';

import {
  CLD_API_HOST,
  JANUS_RTC_HOST,
  JANUS_MESSAGES,
  JANUS_MESSAGE_RESULTS,
  JANUS_EVENTS,
  EVENTS
} from './constants';

const buildRequest = (options) => {
  let headers = new Headers();
  headers.append("X-Requested-With", "XMLHttpRequest");
  let body = new FormData();
  let manifest = {targets: []};
  if (options.hlsTarget) {
    manifest.targets.push({kind: "hls"});
  }
  if (options.fileTarget) {
    manifest.targets.push({kind: "file"});
  }
  if (options.facebookUri) {
    manifest.targets.push({kind: "facebook", uri: options.facebookUri});
  }
  if (options.youtubeUri) {
    manifest.targets.push({kind: "youtube", uri: options.youtubeUri});
  }

  let json = JSON.stringify(manifest);
  console.info(json);

  let blob = new Blob([json], {type: "application/json"});
  body.append("file", blob);

  return {
    method: "POST",
    headers: headers,
    mode: "cors",
    cache: "default",
    body: body
  };
};

/**
 * Initializes the live video stream
 *
 * @param {object} options Configuration options
 * @param {string} options.cloudName (required) The cloud name of the account for upstream
 * @param {string} options.uploadPreset (required) Upload preset for video upload (with live stream enabled)
 * @param {number} options.bandwidth Bitrate used for upstream (default is 1Mbit)
 * @param {object} options.events Events listener object.
 *
 * @return {object} Promise returning the initialization results (public id) and handles to start/stop the streaming.
 */
const initLiveStream = (options) => {
  const opaqueId = "cld-" + Janus.randomString(12);

  let janus = null;
  let cld = null;

  // user configurable values:
  let cloudName = null;
  let uploadPreset = null;

  let started = false;
  let recording = false;
  let recordingId = null;
  let events = null;

  options = options || {};

  let bandwidth = options.bandwidth || (1024 * 1024); // default bandwidth 1Mbit.
  cloudName = options.cloudName;
  uploadPreset = options.uploadPreset;
  events = options.events;

  const janusEventHandlers = {
    [JANUS_EVENTS.PREPARING]: (result, jsep) => {
      let warning = result[JANUS_MESSAGE_RESULTS];
      Janus.log("Preparing the recording playout");
      cld.createAnswer(
        {
          jsep: jsep,
          media: {audioSend: false, videoSend: false, video: "hires"},  // We want recvonly audio/video
          success: function (jsep) {
            Janus.debug("Got SDP!");
            Janus.debug(jsep);
            let body = {"request": "start"};
            cld.send({"message": body, "jsep": jsep});
          },
          error: function (error) {
            Janus.error("WebRTC error:", error);
            sendEvents(EVENTS.ERROR, "WebRTC error: " + error);
          }
        });
      if (warning) {
        sendEvents(EVENTS.WARNING, warning)
      }
    },
    [JANUS_EVENTS.RECORDING]: (result, jsep) => {
      // Got an ANSWER to our recording OFFER
      if (jsep !== null && jsep !== undefined)
        cld.handleRemoteJsep({jsep: jsep});
      let id = result["id"];
      if (id !== null && id !== undefined) {
        Janus.log("The ID of the current recording is " + id);
        recordingId = id;
        sendEvents(EVENTS.START, recordingId);
      }
    },
    [JANUS_EVENTS.SLOW_LINK]: (result) => {

      let uplink = result["uplink"];
      Janus.log("Got slow link notification");
      if (uplink !== 0) {
        // Janus detected issues when receiving our media, let"s slow down
        bandwidth = parseInt(bandwidth / 1.5);
        cld.send({
          message: {
            "request": "configure",
            "video-bitrate-max": bandwidth, // Reduce the bitrate
            "video-keyframe-interval": 5000 // Keep the 5 seconds key frame interval
          }
        });
      }
    },
    [JANUS_EVENTS.STOPPED]: (result) => {
      Janus.log("Session has stopped!");
      let id = result["id"];
      if (recordingId !== null && recordingId !== undefined) {
        if (recordingId !== id) {
          Janus.warn("Not a stop to our recording?");
          return;
        }
        sendEvents(EVENTS.STOP, recordingId);
      }

      recordingId = null;
      recording = false;
      cld.hangup();
    }
  };

  /**
   * Starts the live video streaming.
   *
   * @param {string} publicId The public id of the video resource generated. This is the public-id returned from the
   * initLiveStream function.
   */
  let start = function (publicId) {
    // before, after, during recording
    cld.send({
      "message": {
        "request": "configure",
        "video-bitrate-max": bandwidth,
        "video-keyframe-interval": 5000, // 5 seconds
      }
    });

    cld.createOffer(
      {
        // By default, it's sendrecv for audio and video...
        media: {video: "hires"},
        success: function (jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          let body = {
            "request": "record",
            "cloud-name": cloudName,
            "resource-uri": "video/upload/" + publicId
          };
          cld.send({"message": body, "jsep": jsep});
        },
        error: function (error) {
          Janus.error("WebRTC error...", error);
          cld.hangup();
        }
      });
  };

  /**
   * Stops the live streaming
   */
  let stop = function () {
    cld.send({message: {"request": "stop"}});
    cld.hangup();
  };

  let attach = function (videoView, stream) {
    Janus.attachMediaStream(videoView, stream);
  };

  return new Promise(function (resolve, reject) {
      let janusOptions = {
        debug: options.debug,
        dependencies: options.dependencies,
        callback: function () {
          if (!started) {
            started = true;

            if (Janus.isWebrtcSupported()) {
              // Create session
              janus = buildJanus(resolve, reject);
            } else {
              reject("WebRTC is not supported");
            }
          }
        }
      };

      Janus.init(janusOptions);
    }
  ).then(() => {
    recording = true;
    let url = "https://" + CLD_API_HOST + "/v1_1/" + cloudName + "/video/upload?upload_preset=" + uploadPreset;
    return fetch(url, buildRequest(options));
  }).then(response => {
    if (response.status !== 200) {
      recording = false;
      let err = "Failed uploading live resource. Response code: " + response.status;
      throw new TypeError(err);
    }

    return response.json();
  }).then((json) => {
    return {response: json, start, stop, attach};
  });

  function buildJanus(resolve, reject) {
    function success() {
      // Attach to cloudinary plugin
      janus.attach(
        {
          plugin: "janus.plugin.cld",
          opaqueId: opaqueId,
          success: function (pluginHandle) {
            cld = pluginHandle;
            Janus.log("Plugin attached! (" + cld.getPlugin() + ", id=" + cld.getId() + ")");
            resolve();
          },
          error: function (error) {
            Janus.error("  -- Error attaching plugin...", error);
            reject("  -- Error attaching plugin...", error);
          },

          consentDialog: function (on) {
            Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
          },

          webrtcState: function (on) {
            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
          },

          onmessage: function (msg, jsep) {
            Janus.debug(" ::: Got a message :::");
            Janus.debug(JSON.stringify(msg));
            let result = msg[JANUS_MESSAGES.RESULT];
            if (result !== null && result !== undefined) {
              let resultStatus = result[JANUS_MESSAGE_RESULTS.STATUS];
              if (resultStatus !== undefined && resultStatus !== null) {
                if (janusEventHandlers[resultStatus]) {
                  // call handler with full result (for the extra parameters inside):
                  janusEventHandlers[resultStatus](result, jsep);
                }
              }
            } else {
              let error = msg[JANUS_MESSAGES.ERROR];
              recording = false;
              cld.hangup();
              sendEvents(EVENTS.ERROR, error);
            }
          },
          onlocalstream: function (stream) {
            Janus.debug(" ::: Got a local stream :::");
            Janus.debug(JSON.stringify(stream));
            sendEvents(EVENTS.LOCAL_STREAM, stream);
          },
          onremotestream: function (stream) {
            Janus.debug(" ::: Got a remote stream :::");
            Janus.debug(JSON.stringify(stream));
            sendEvents(EVENTS.REMOTE_STREAM, stream);
          },
          oncleanup: function () {
            Janus.log(" ::: Got a cleanup notification :::");
          }
        });
    }

    function error(error) {
      Janus.error(error);
      reject("Could not initialize live streaming");
    }

    function destroyed() {
      sendEvents(EVENTS.DESTROYED)
    }

    return new Janus({
      server: JANUS_RTC_HOST,
      success,
      error,
      destroyed
    });
  }

  function sendEvents(name, data) {
    if (events && events[name]) {
      events[name](data);
    }
  }
};

export {initLiveStream};
