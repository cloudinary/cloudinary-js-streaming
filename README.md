Cloudinary
==========

Cloudinary is a cloud service that offers a solution to a web application's entire image and video management pipeline.
Easily upload images and videos to the cloud. Automatically perform smart resizing, cropping and conversion 
without installing any complex software. 
Cloudinary offers comprehensive APIs and administration capabilities and is easy to integrate with any web application,
existing or new.
Cloudinary provides URL and HTTP based APIs that can be easily integrated with any Web development framework.

Video live-stream 
=================

Cloudinary provides an end-to-end live video streaming solution, with on the fly video effects and transformations.
This SDK enables integration of live-streaming capabilities into any website.

## Setup ######################################################################

```npm install cloudinary-live-stream```

Sign up for a [free account](https://cloudinary.com/users/register/free).

After registering, you'll need to create an upload preset [here](https://cloudinary.com/console/upload_presets/new), 
and enable the ****live-streaming**** setting.

## Usage ######################################################################

```javascript
import initLiveStream from 'cloudinary-live-stream'

// ...

// configure your cloud name and the live-stream enabled upload-prest:
const cloudName = [your-cloud-name];
const uploadPreset = [your-upload-preset];
let liveStreamLibrary;

// ...

// call initLiveStream with the configuration parameters:
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
  
  // start the streaming:
  liveStreamLibrary.start(publicId);
})
```
