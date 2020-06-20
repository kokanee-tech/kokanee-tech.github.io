import AudioSupport from "../../src/AudioSupport.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention
const ERROR_NO_GAMEPAD = `No active gamepad detected. Support is currently limited to:
  - Chrome v83+ on macOS v10.11.5+
  - Xbox One Wireless Controller`;

const doStuff = async () => {
  const canvas = document.getElementById(MAIN_CANVAS_ID);

  function isGamepadConnected() {
    const gamepads = navigator.getGamepads();
    if (gamepads.length) {
      const gamepad = gamepads[0];
      if (gamepad) {
        return true;
      }
    }
    return false;
  }

  function update() {
    try {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const context = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(w, 0);
      context.lineTo(w, h);
      context.lineTo(0, h);
      context.lineTo(0, 0);
      context.lineTo(w, h);
      context.moveTo(0, h);
      context.lineTo(w, 0);
      context.moveTo(w / 2, 0);
      context.lineTo(w, h / 2);
      context.lineTo(w / 2, h);
      context.lineTo(0, h / 2);
      context.lineTo(w / 2, 0);
      context.stroke();
      requestAnimationFrame(update);
    } catch (err) {
      console.error("Execution failed: " + err.message);
      window.alert("Opps, something went wrong.");
    }
  }

  if (!isGamepadConnected()) {
    alert(ERROR_NO_GAMEPAD);
    return;
  }

  update();

  const timerName = "audio ready";
  console.time(timerName);
  await new AudioSupport(new AudioContext()).audioReady(canvas, "click");
  console.timeEnd(timerName);
};

doStuff();
