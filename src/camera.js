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
const attachCamera = (videoElement, facingMode) => {
  return new Promise((resolve, reject) => {
    const options = facingMode ? {video: {facingMode}} : {video: true};
    navigator.mediaDevices.getUserMedia(options).then(stream => {
      videoElement.srcObject = stream;
      resolve(stream);
    })
      .catch(e => {
        reject(e)
      });
  });
};

/**
 * Detach camera from an html video element
 * @param videoElement - The video element to detach the camera from
 */
const detachCamera = (videoElement) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = videoElement.srcObject;
      if (stream) {
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop);
        videoElement.srcObject = null;
      }
      resolve(videoElement)
    } catch (e) {
      reject(e);
    }
  });
};

export {attachCamera, detachCamera};
