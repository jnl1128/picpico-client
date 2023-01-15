import { syncMyPeersReceiver } from "./receiver.mjs";
import { syncMyPeersSegment } from "./segment.mjs";
import { syncMyPeersStream } from "./stream.mjs";

let socket;
let myStream;

const FRAME_RATE = 30;

let videoWidth = 400;
let videoHeight = 400;
const myVideo = document.getElementById("myVideo");
const myCanvas = document.getElementById("myCanvas");

const cameraList = [];

/* myPeers
 *    key    :    value
 *
 * socketId  :    myPeer
 *            {
 *                connection    :
 *                videoElement  :
 *                alphaChannel  :
 *                alphaReceived :
 *            }
 */

const myPeers = {};

export class myPeer {
  connection;
  videoElement;
  alphaChannel;
  alphaReceived;

  constructor(newConnection) {
    this.connection = newConnection;
    this.videoElement = document.createElement("video");
    this.videoElement.hidden = true;
    this.alphaChannel = null;
    this.alphaReceived = null;
  }
}

/***** Functions ******/

const handleIce = data => {
  const mySocketId = socket.id;
  for (const [peerSocketId, myPeer] of Object.entries(myPeers)) {
    if (myPeer.connection === data.target) {
      console.log("[ice] - emit - client");
      socket.emit("ice", data.candidate, peerSocketId, mySocketId);
      break;
    }
  }
};

const handleTrack = data => {
  if (data.track.kind === "video") {
    const videoRow = document.getElementById("peerVideos");
    const peerVideo = document.createElement("video");

    peerVideo.hidden = true;
    peerVideo.autoplay = true;
    peerVideo.className = "col";
    peerVideo.setAttribute("playsinline", "playsinline");

    peerVideo.srcObject = data.streams[0];
    videoRow.appendChild(peerVideo);
  }
};

function makeConnection(socketId) {
  const newConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });

  if (socketId !== "") {
    const newPeer = new myPeer(newConnection);
    myPeers[socketId] = newPeer;

    syncMyPeers();

    newConnection.addEventListener("icecandidate", handleIce);
    newConnection.addEventListener("track", handleTrack);

    myStream.getTracks().forEach(track => {
      newConnection.addTrack(track, myStream);
    });

    return newPeer;
  }
}

function syncMyPeers() {
  console.log(">>>>>syncMyPeers Called");
  syncMyPeersStream(myPeers);
  syncMyPeersReceiver(myPeers);
  syncMyPeersSegment(myPeers);
}

async function onWelcomeEvent(newSocketId) {
  console.log("[welcome] - on - client");

  const newPeer = makeConnection(newSocketId);
  const newConnection = newPeer.connection;
  const newAlphaChannel = newConnection.createDataChannel("alphaChannel");
  newPeer.alphaChannel = newAlphaChannel;

  newAlphaChannel.addEventListener("message", event => {
    newPeer.alphaReceived = new Uint8Array(event.data);
  });

  const offer = await newConnection.createOffer();
  newConnection.setLocalDescription(offer);

  socket.emit("offer", offer, newSocketId, socket.id);
  console.log("[offer] - emit - client");
}

function onDataChannelEvent(event, socket) {
  console.log(">>>>>dataChannel received", event.data);

  myPeers[socket.id].alphaChannel = event.channel;

  event.channel.addEventListener("message", event => {
    myPeers[socket.id].alphaReceived = new Uint8Array(event.data);
  });
}

async function onOfferEvent(offer, oldSocketId) {
  console.log("[offer] - on - client");

  const newPeer = makeConnection(oldSocketId);
  const newConnection = newPeer.connection;

  newConnection.setRemoteDescription(offer);
  const answer = await newConnection.createAnswer();
  newConnection.setLocalDescription(answer);

  socket.emit("answer", answer, oldSocketId, socket.id);
  console.log("[answer] - emit - client");
}

function onAnswerEvent(answer, newSocketId) {
  console.log("[answer] - on - client");
  const connection = myPeers[newSocketId].connection;
  connection.setRemoteDescription(answer);
}

function onIceEvent(ice, socketId) {
  if (ice) {
    const connection = myPeers[socketId].connection;
    if (connection) {
      connection.addIceCandidate(ice);
    }
  }
}

export async function initWebRTC(_socket) {
  socket = _socket;
  socket.on("welcome", onWelcomeEvent);
  socket.on("datachannel", (event, socket) => onDataChannelEvent(event, socket));
  socket.on("offer", onOfferEvent);
  socket.on("answer", onAnswerEvent);
  socket.on("ice", onIceEvent);
}
