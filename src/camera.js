/**
 * Attach camera to an html video element
 * @param videoElement - The video element to attach the camera to
 * @param facingMode - The camera to use, for example: facingMode: { exact: "user" }
 * Read more here: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
 */
const attachCamera = async (videoElement, facingMode) => {
    let options = facingMode ? {video: {facingMode}} : {video: true};
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia(options);
    //return new Promise(resolve => video.onplaying = resolve(videoElement));
};

/**
 * Detach camera from an html video element
 * @param videoElement - The video element to detach the camera from
 */
const detachCamera = async (videoElement) => {
  const stream = videoElement.srcObject;
  if (stream) {
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop);
    videoElement.srcObject = null;
  }
};

export {attachCamera, detachCamera};
