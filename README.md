Cloudinary Live-stream 
======================

This sdk provides easy integration with Cloudinary's live video streaming capabilities.

## Setup ######################################################################

```npm install cloudinary-live-stream```

## Usage ######################################################################

```javascript
import initLiveStream from 'cloudinary-live-stream'

// ...

const cloudName = [your-cloud-name];
const uploadPreset = [your-upload-preset];
let liveStreamLibrary;

// ...

initLiveStream({
 cloudName: cloudName,
            uploadPreset: uploadPreset,
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
                  // user code, typically attaching the stream to a video view:
                  liveStreamLibrary.attach($("#thevideo").get(0), stream);
                }
            }
}).then((result) => {
  // keep handle to instance to start/stop streaming 
  liveStreamLibrary = result;
  
  
  // Extract public id from result to share (necessary to watch the stream):
  let publicId = result.response["public_id"];
  
  // start streaming:
  liveStreamLibrary.start(publicId);
})
```

## Build the sdk ######################################################################

```npm install```

