import {initLiveStream} from "./stream";
import {attachCamera, detachCamera} from "./camera";

/**
 * Streamer is a convenient wrapper for camera and streaming functions
 * It exposes functions for showing, hiding and streaming from a camera
 */
class Streamer {
  /**
   * Create a new Streamer
   * @param videoElement - reference to an html video element
   */
  constructor(videoElement) {
    this.setVideoElement(videoElement);
  }

  /**
   * Set this Streamer's html video element
   * @param videoElement - reference to an html video element
   */
  setVideoElement(videoElement) {
    this.videoElement = videoElement;
  }

  /**
   * Attach camera to this Streamer's html video element
   * @param facingMode - The camera to use, for example: facingMode: { exact: "user" }
   * Read more here: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
   */
  attachCamera(facingMode) {
    return attachCamera(this.videoElement, facingMode);
  }

  /**
   * Detach camera from this Streamer's html video element
   * @param stopStream - (true by default) when true will stop all stream tracks
   */
  detachCamera(stopStream = true) {
    return detachCamera(this.videoElement, stopStream);
  }

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
  static initLiveStream(options) {
    return initLiveStream(options);
  }
}

export {Streamer};
