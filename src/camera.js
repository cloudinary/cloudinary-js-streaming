export const REAR_CAMERA = {audio: true, video: { facingMode: "environment" } };
export const FRONT_CAMERA = {audio: true, video: { facingMode: "user" } };

/**
 * Attach camera to an html video element
 * Uses the navigator.mediaDevices.getUserMedia method.
 * @param videoElement - The video element to attach the camera to
 * @param facingMode - The camera to use, for example: facingMode: { exact: "user" }
 * Read more here: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
 * @returns a Promise that resolves to the result of the navigator.mediaDevices.getUserMedia method
 * Or rejects with an Error.
 * Read more here: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const attachCamera = async (videoElement, facingMode) => {
  const stream = await getStream({video: facingMode || true});
  attachStream(videoElement, stream);
  return stream;
};

export const attachStream = (videoElement, stream) => {
  videoElement.srcObject = stream;
};

export const getStream = (options) => {
    return navigator.mediaDevices.getUserMedia(options || {video: true, audio: true});
};

/**
 * Detach camera from an html video element
 * @param videoElement - The video element to detach the camera from
 * @param stopStream - (true by default) when true will stop all stream tracks
 */
export const detachCamera = (videoElement, stopStream = true) => {
  return new Promise((resolve, reject) => {
    try {
      if (videoElement.srcObject) {
        if (stopStream) {
          videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
        videoElement.srcObject = null;
      }
      resolve(videoElement)
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * List cameras and microphones
 * @returns {Promise<MediaDeviceInfo[]>}
 */
export const listDevices = () => {
  return navigator.mediaDevices.enumerateDevices();
};
