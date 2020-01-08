Cloudinary
==========

Cloudinary is a cloud service that offers a solution to a web application's entire image and video management pipeline.
Easily upload images and videos to the cloud. Automatically perform smart resizing, cropping and conversion 
without installing any complex software. 
Cloudinary offers comprehensive APIs and administration capabilities and is easy to integrate with any web application,
existing or new.

Video live-stream 
=================

Cloudinary provides an end-to-end live video streaming solution, with on the fly video effects and transformations.
When using the library in your website this is what happens:
1. Video is streamed from the device's camera.
2. The video is up-streamed through Cloudinary, providing the streaming user with a Cloudinary public id and resource
 url of the stream.
3. The stream is now publicly available through that url, and can be fed into any streaming-supported video player.
4. If any transformations and effects were added to the stream (during configuration, see below) all the viewers will
see the modified stream.
## Setup ######################################################################

1. Sign up for a [free account](https://cloudinary.com/users/register/free).

2. Create an upload preset [here](https://cloudinary.com/console/upload_presets/new), and enable 
the ****live-streaming**** setting. This is also the place to add any wanted effects and transformations under the 
'Incoming transformations' section.

3. fetch the library from npm:

    ```npm install @cloudinary/js-streaming```

## Usage ######################################################################

After completing the setup, import the library and initialize it. There are two required parameters:
* cloudName - this is the cloud name assigned to you when creating the Cloudinary free account.
* uploadPreset - This is the name of the upload preset created in step two of the setup.

There are several optional parameters:
* `debug`: Log level (disabled by default), one of, or array of ```['trace', 'debug', 'vdebug', 'log', 'warn', 'error']```. pass in ```'all'``` to print all
 messages.
* `bandwidth`: Bandwith, in bits. Default is 1Mbit/s (1024 * 1024).
* `hlsTarget`: `[true/false]`, When true, will stream live using hls protocol.
* `fileTarget`: `[true/false]`, When true, will save an mp4 file in your Cloudinary media library.
* `facebookUri`: A Facebook streaming URI used to direct the stream to facebook. 
Supplied by facebook when configuring Facebook streaming.
* `youtubeUri`: A Youtube streaming URI used to direct the stream to Youtube. Supplied by youtube when configuring
 Youtube streaming.
* `events`: callback for events, supporting the following functions:
    * `start`: Called when the streaming starts. Includes the recording Id. 
    * `stop`: Called when the streaming stops. Includes the recording Id.
    * `error`: Called when the library encounters an error. The error message is included in the callback.
    * `local_stream`: Called when the stream is available locally (stream is provided in the callback). This can be used 
    to display to the user his own streaming as it up-streams.
    
```javascript
import initLiveStream from 'cloudinary@/js-streaming'

// ...

// configure your cloud name and the live-stream enabled upload-preset:
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
  
  
  // Extract public id and url from result (publish the url for people to watch the stream):
  let publicId = result.response.public_id;
  let url = result.response.secure_url;
  
  // start the streaming:
  liveStreamLibrary.start(publicId);
})
```

## Additional resources ##########################################################

Additional resources are available at:

* [Website](https://cloudinary.com)
* [Interactive demo](https://demo.cloudinary.com/live)
* [Documentation](https://cloudinary.com/documentation)
* [Knowledge Base](https://support.cloudinary.com/hc/en-us)
* [Video transformations documentation](https://cloudinary.com/documentation/video_manipulation_and_delivery)

## Support

You can [open an issue through GitHub](https://github.com/cloudinary/cloudinary-live-stream-js/issues).

Contact us [https://cloudinary.com/contact](https://cloudinary.com/contact)

Stay tuned for updates, tips and tutorials: [Blog](https://cloudinary.com/blog), [Twitter](https://twitter.com/cloudinary), [Facebook](https://www.facebook.com/Cloudinary).

## Join the Community ##########################################################

Impact the product, hear updates, test drive new features and more! Join [here](https://www.facebook.com/groups/CloudinaryCommunity).


## License #######################################################################

Released under the MIT license.
