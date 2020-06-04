try {
  const MAIN_CANVAS_ID = "main-canvas"; // by convention
  const canvas = document.getElementById(MAIN_CANVAS_ID);
  const context = canvas.getContext("2d");
  context.fillRect(10, 10, 100, 100);
} catch (err) {
  console.error("Execution failed: " + err.message);
  window.alert("Opps, something went wrong.");
}
