import store from "../store.js";
import { setStrokeInfo, addStrokeHistory } from "../slice/drawingInfo.js";
export const onStrokeCanvasEvent = (offsetX, offsetY, color, socketId, idx, lineWidth) => {
  store.dispatch(setStrokeInfo({ value: [offsetX, offsetY, color, socketId, idx, lineWidth] }));
};

export const onMouseDownEvent = (socketId, offsetX, offsetY, idx) => {
  console.log("on mouse down from someone", socketId, offsetX, offsetY);
  store.dispatch(addStrokeHistory({ value: [socketId, offsetX, offsetY, idx, true] }));
};

export const onMouseUpEvent = (socketId, offsetX, offsetY, idx) => {
  console.log("on mouse up from someone", socketId, offsetX, offsetY);
  store.dispatch(addStrokeHistory({ value: [socketId, offsetX, offsetY, idx, false] }));
};
