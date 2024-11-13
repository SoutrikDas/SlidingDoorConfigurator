// slider.js
let base = {}; // Store base positions for translation

// Get the slider element and add an event listener for the input event
const primarySlider = document.getElementById("primarySlider");
const primarySliderValue = document.getElementById("primarySliderValue");

primarySlider.addEventListener("input", sliderHandler);

function sliderHandler(event) {
  const value = parseFloat(event.target.value); // Get the slider value
  primarySliderValue.textContent = value.toFixed(2); // Update the display with the current value

  // The logic to translate the door based on slider value (Y-axis translation)
  // Assuming the "door" is represented by node ID 0 (you can adjust this based on your model)
  const nodeID = 0; // Replace with actual node ID if needed

  if (api) {
    api.getMatrix(nodeID, function (err, matrix) {
      if (!err) {
        const newPosition = [
          matrix.world[12],
          matrix.world[13] + value,
          matrix.world[14],
        ];

        // Apply the translation
        api.translate(nodeID, newPosition, {}, function (err, translateTo) {
          if (!err) {
            console.log("Door position updated to:", translateTo);
          } else {
            console.error("Translation failed:", err);
          }
        });
      }
    });
  }
}
