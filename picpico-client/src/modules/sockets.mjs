import { io } from "socket.io-client";
import { CREDENTIAL } from "../config.js";
import { onDoneTakeEvent } from "./takePic.mjs";
import { BASE_URL } from "../config.js";
import { onResetMemberEvent } from "./resetMember.mjs";
import { onStrokeCanvasEvent, onMouseDownEvent } from "./strokeCanvas.mjs";
import { onPickPicEvent } from "./pickPic.mjs";
import { onNextStepEvent, onPermissionDeniedEvent } from "./nextStep.mjs";

// let socket;
const socketOptions = { withCredentials: CREDENTIAL.withCredentials };
const SERVER = BASE_URL;

export const socket = io(SERVER, socketOptions);

export const addMemberEvent = async (roomId, nickname) => {
  socket.emit("add_member", roomId, nickname);
};

export async function joinRoom(roomId) {
  socket.emit("join_room", roomId, socket.id);
  socket.on("reset_member", onResetMemberEvent);
  socket.on("pick_pic", onPickPicEvent);
  socket.on("done_take", onDoneTakeEvent);
  socket.on("stroke_canvas", onStrokeCanvasEvent);
  socket.on("mouse_down", onMouseDownEvent);
  socket.on("next_step", onNextStepEvent);
  socket.on("permission_denied", onPermissionDeniedEvent);
}
