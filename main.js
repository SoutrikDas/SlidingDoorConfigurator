// Initialize Sketchfab Viewer
const iframe = document.getElementById("api-frame");
const uid = "b95f24d793a440d08e0046a5174e8c7c"; // Replace with your model's UID
let api;
const version = "1.12.1";
let base = {};
let _nodes;
let baseDoor = [];
let baseHandles = [];
// Initialize Sketchfab client and load the model
const client = new Sketchfab(version, iframe);
let interiorColor = "white";
let exteriorColor = "black";
let handleColor = undefined;
let myMaterials = [];

const interiorColors = {
  white: "#f3f4f5",
  black: "#16151c",
  brown: "#514431",
  tan: "#c8baa5",
  "morning-sky-gray": "#cecfd0",
};

function hexToRgbArray(hex) {
  // Remove "#" if present
  hex = hex.replace(/^#/, "");

  // Check for valid 6-character hex color
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16) / 255; // Convert to [0, 1]
    const g = parseInt(hex.slice(2, 4), 16) / 255; // Convert to [0, 1]
    const b = parseInt(hex.slice(4, 6), 16) / 255; // Convert to [0, 1]
    return [r, g, b]; // Return an array [r, g, b] with normalized values
  } else {
    return null; // Invalid hex code
  }
}

function setColor(materialName, hexcode) {
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name == materialName) {
      materialToChange = m;
      console.log(`Material to Change has been found`);
    }
  }
  materialToChange.channels.AlbedoPBR.factor = 1;
  materialToChange.channels.AlbedoPBR.enable = true;
  materialToChange.channels.AlbedoPBR.color = hexToRgbArray(hexcode);

  // materialToChange.channels.DiffuseColor.factor = 1;
  // materialToChange.channels.DiffuseColor.color = hexToRgbArray(hexcode);
  console.log("Final material:" + materialName);
  console.log(materialToChange);
  api.setMaterial(materialToChange);
}

const grillTypes = {
  prairie: [457, 1019],
  traditional: [634, 1196],
  topRow: [558, 1120],
};
const handleID = 412;

function onSuccess(apiInstance) {
  api = apiInstance;
  api.start();
  api.addEventListener("viewerready", function () {
    console.log("Viewer is absolutely ready");
    onModelLoaded(api);
  });
}

function onError() {
  console.log("Viewer error");
}

// Initialize the Sketchfab viewer
client.init(uid, {
  success: onSuccess,
  error: onError,
  autostart: 1,
  preload: 1,
  animation_autoplay: 0,
  annotation: 0,
  annotation_tooltip_visible: 0,
  annotations_visible: 0,
  ui_animations: 0,
  ui_controls: 0,
  ui_general_controls: 0,
  ui_infos: 0,
  ui_stop: 0,
  ui_inspector: 0,
  ui_watermark_link: 0,
  ui_watermark: 0,
  ui_ar: 0,
  ui_help: 0,
  ui_settings: 0,
  ui_vr: 0,
  ui_fullscreen: 0,
  transparent: 1,
  ui_color: "222222",
});

// Log all parts in the model (node map)
function logAllParts(api) {
  api.getNodeMap(function (err, nodes) {
    if (!err) {
      window.console.log(nodes);
      Object.values(nodes).forEach((node) => {
        console.log(
          `InstanceID : ${node.instanceID}, Part Type: ${node.type}, Name: ${node.name}`
        );
      });
    }
    _nodes = nodes;
  });
}

function onModelLoaded(api) {
  console.log("Model has been loaded");
  logAllParts(api);
  getSliderWorldCoordinates(api);
  hideAllGrills();
  // Show the default grill (Traditional, for instance)
  showGrillType("traditional");
  logAllMaterials(api);
}

function getSliderWorldCoordinates(api) {
  const nodeInstanceID = 217; // The instance ID for the primary slider

  // Get the world matrix of the node
  api.getMatrix(nodeInstanceID, function (err, matrix) {
    if (!err) {
      // Extract the X, Y, Z coordinates from the world matrix
      const x = matrix.world[12]; // X coordinate
      const y = matrix.world[13]; // Y coordinate
      const z = matrix.world[14]; // Z coordinate

      // Store them in the baseDoor array
      baseDoor = [x, y, z];

      console.log("Slider World Coordinates: ", baseDoor);
    } else {
      console.error("Error getting matrix for instance ID 217:", err);
    }
  });

  // also get the handles base values
  api.getMatrix(handleID, function (err, matrix) {
    if (!err) {
      // Extract the X, Y, Z coordinates from the world matrix
      const x = matrix.world[12]; // X coordinate
      const y = matrix.world[13]; // Y coordinate
      const z = matrix.world[14]; // Z coordinate

      // Store them in the baseDoor array
      baseHandles = [x, y, z];

      console.log("Handle World Coordinates: ", baseHandles);
    } else {
      console.error("Error getting matrix for instance ID Handles:", err);
    }
  });
}

function showGrillType(grillType) {
  // First, hide all grill types
  hideAllGrills();

  // Now, show the selected grill type
  switch (grillType) {
    case "prairie":
      grillTypes.prairie.forEach((instanceId) => {
        api.show(instanceId, function (err) {
          if (!err) {
            console.log(`Showed node ${instanceId}`);
          }
        });
      });
      break;
    case "traditional":
      grillTypes.traditional.forEach((instanceId) => {
        api.show(instanceId, function (err) {
          if (!err) {
            console.log(`Showed node ${instanceId}`);
          }
        });
      });
      break;
    case "topRow":
      grillTypes.topRow.forEach((instanceId) => {
        api.show(instanceId, function (err) {
          if (!err) {
            console.log(`Showed node ${instanceId}`);
          }
        });
      });
      break;
  }
}

function hideAllGrills() {
  // Hide all grill nodes
  Object.values(grillTypes).forEach((grillArray) => {
    grillArray.forEach((instanceId) => {
      api.hide(instanceId, function (err) {
        if (!err) {
          console.log(`Hid node ${instanceId}`);
        }
      });
    });
  });
}

// Handle Slider Input (Door Slider)
function sliderHandler(event) {
  const element = event.target;
  const value = parseFloat(element.value);

  const zOffset = -0.03;
  // Directly use the instance ID for the primary slider node
  const nodeInstanceID = 217; // The instance ID for the primary slider

  console.log(`Slider value: ${value}, Node: ${nodeInstanceID}`);

  // Assuming base[nodeInstanceID] stores the initial position for translation
  const newPosition = [baseDoor[0] + value, baseDoor[1], baseDoor[2] + zOffset];
  // const newHandlePosition = [
  //   baseHandles[0] + value,
  //   baseHandles[1],
  //   baseHandles[2],
  // ];
  api.translate(nodeInstanceID, newPosition, {}, function (err, translateTo) {
    if (!err) {
      console.log("Object has been translated to", translateTo);
    } else {
      console.error("Translation failed:", err);
    }
  });

  // api.translate(handleID, newHandlePosition, {}, function (err, translateTo) {
  //   if (!err) {
  //     console.log("Handle has been translated to", translateTo);
  //   } else {
  //     console.error("Translation failed:", err);
  //   }
  // });
}

// Handle the primary slider (door slider)
document
  .getElementById("primarySlider")
  .addEventListener("input", sliderHandler);

document.querySelectorAll(".interior-color").forEach((element) => {
  element.addEventListener("click", colorSelectHandler);
});

function colorSelectHandler(event) {
  const selectedColor = event.target.getAttribute("data-color");
  console.log(`Selected color : ${selectedColor}`);

  interiorColor = selectedColor;
  setColor("Exterior", interiorColors[interiorColor]);
}

// Function to update available exterior color options based on the selected interior color
function updateExteriorColorOptions(selectedInteriorColor) {
  exteriorColorCircles.forEach((circle) => {
    const circleColor = circle.getAttribute("data-color").split("-")[1];
    if (selectedInteriorColor === "white") {
      // White interior restricts exterior to White only
      circle.style.display = circleColor === "white" ? "inline-block" : "none";
    } else {
      // Show all exterior colors
      circle.style.display = "inline-block";
    }
  });
}

// Handle Grill Type Selection
const grillButtons = document.querySelectorAll(".grill-button");

grillButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedGrill = e.target.id;
    console.log(`Grill type selected: ${selectedGrill}`);
    updateGrillButtonStyles(selectedGrill);
    showGrillType(selectedGrill);
  });
});

// Update button styles based on selected grill type
function updateGrillButtonStyles(selectedGrill) {
  grillButtons.forEach((button) => {
    if (button.id === selectedGrill) {
      button.classList.add("bg-blue-500", "text-white");
      button.classList.remove("bg-gray-300", "text-gray-700");
    } else {
      button.classList.add("bg-gray-300", "text-gray-700");
      button.classList.remove("bg-blue-500", "text-white");
    }
  });
}

// Handle Lock (Handle) Color Selection
const lockButtons = document.querySelectorAll(".lock-button");

lockButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedLockColor = e.target.style.backgroundColor;
    console.log(`Lock (Handle) color selected: ${selectedLockColor}`);
    updateLockButtonStyles(e.target);
  });
});

function logAllMaterials(api) {
  // Get the list of all materials in the scene
  api.getMaterialList(function (err, materials) {
    if (err) {
      console.error("Error getting materials:", err);
      return;
    }

    // Log each material's details
    myMaterials = materials;
    materials.forEach((material, index) => {
      console.log(`Material ${index}:`, material);
    });
  });
}

// Update button styles when lock color is selected
function updateLockButtonStyles(selectedButton) {
  lockButtons.forEach((button) => {
    button.classList.remove("border-4", "border-blue-500");
  });
  selectedButton.classList.add("border-4", "border-blue-500");
}
