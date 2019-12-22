const CLD_API_HOST = "api.cloudinary.com";
const JANUS_RTC_HOST = "wss://webrtc-api.cloudinary.com/janus";

const JANUS_MESSAGES = {
  RESULT: "result",
  ERROR: "error"
};

const JANUS_MESSAGE_RESULTS = {
  ID: "id",
  UPLINK: "uplink",
  WARNING: "warning",
  STATUS: "status"
};

const JANUS_EVENTS = {
  PREPARING: "preparing",
  RECORDING: "recording",
  SLOW_LINK: "slow_link",
  STOPPED: "stopped"
};

const EVENTS = {
  START: "start",
  STOP: "stop",
  WARNING: "warning",
  ERROR: "error",
  LOCAL_STREAM: "local_stream",
  REMOTE_STREAM: "remote_stream",
  DESTROYED: "destroyed"
};

export {
  CLD_API_HOST,
  JANUS_RTC_HOST,
  JANUS_MESSAGES,
  JANUS_MESSAGE_RESULTS,
  JANUS_EVENTS,
  EVENTS
};
