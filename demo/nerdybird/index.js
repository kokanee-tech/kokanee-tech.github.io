import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
There appears to be a bug in the gamepad drivers: If you switch to another window,
the gamepad API stops updating the button value, and it fails to refresh the value
when the page becomes visible again.
Possible workaround: Listen for page visbility events and pause the sim when not visible.
Note that the browser also stops sending rAF when not visible.d

ok why after gamepad has disconnected:
Cmd-S in VSCode (with LiveServer running) resumes audio, until you switch to the browser and then it stops ==> rAF? yes
the above workaround should alleviate that --> NO YOU NEED TO *** start with the gain node set to zero ***
*/

/*
TODO:
- Mute/pause sim while not visible
- Replase CyclicSoundGenerator with Helicopter class to encapsulate concerns
- Proper motor spool-up as per spec
- *** start with the gain node set to zero ***
*/

/*
- add a dependency called "page" or "document" with which a caller can register for page visibility events
- the handler is passed a boolean "isVisible"
*/
