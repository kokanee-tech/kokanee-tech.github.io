import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
 TODO
 - pause simulation when page becomes not visible (eg add a new dependency that issues page visibility events?)

 Simulation provides a setPaused(bool) that controls the master gain and sets the internal paused flag
 App uses the provided dependency to call setPaused accordingly
 App still polls gamepad and calls setPaused like it does now

 ================================================================================================
 As a sim dev, I want to know the page visibility and the gamepad connection status regardless of
 whether the animation is running.

 This will let me:
 (1) Show a message when gamepad is not connected
 (2) Mute audio when gamepad is not connected or page is not visible
 (3) Start with audio muted in case page is initially not visible, without being concerned about
     a failure to unmute due to the lack of an animation frame handler that resets the gain
 ================================================================================================

 What if we "inject" our own "fake" animation events while the page is not visible?
 This is dicey because the browser will throttle any timer events (e.g., to 1000ms).

 Or trigger the animation listener (callback) on page viz events?

 ====================================================================
 As a sim dev, I prefer the polling model to the event handler model.
 Otherwise I need to promote the master gain node from a local var
 to a property.
 ====================================================================

 If I leave the rAF framework as-is and just add a dependency for polling page viz,
 will the code EVER see a value of false for page viz inside a rAF callback?
 If not, then perhaps I need to modify the rAF framework to include callbacks for
 page viz events.
*/
