Cloudinary Live-stream SDK 
==========================

This sdk provides easy integration with Cloudinary's live video streaming capabilities.

## Setup ######################################################################

```npm install cloudinary-live-stream ```

## Usage ######################################################################

```javascript
import [placeholder]
.
.
.
placeholder.default({
 cloudName: [your-cloud-name],
            uploadPreset: [your-live-stream-enabled-upload-preset],
            debug: "all",
            hlsTarget: true,
            fileTarget: true,
            events: {
                start: function (args) {
                  // user code
                },
                stop: function (args) {
                  // user code
                },
                error: function(error){
                  // user code
                },
                local_stream: function (stream) {
                  // user code, typically attaching the stream to a video view using Janus helpers:
                  Janus.attachMediaStream($("#thevideo").get(0), stream);
                }
            }
}).then((result) => {
  // keep handle to instance to start/stop streaming 
  let liveStreamLibrary = result;
  
  // Extract public id from result to share (necessary to watch the stream):
  currPublicId = result.response["public_id"];
})
```

## Build the sdk ######################################################################

```npm install```

