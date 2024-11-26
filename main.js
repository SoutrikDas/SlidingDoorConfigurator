// Initialize Sketchfab Viewer
const iframe = document.getElementById("api-frame");
const uid = "df948c96bc0c435b95b129ca0ff37cd0"; // Replace with your model's UID
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
const cameraSettings = {
  laptop: {
    interior: {
      position: [0.9080488874565105, -3.366425992671914, 2.148017341436057],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    intermediate: {
      position: [-2.4443003885814094, 0.08658094024337017, 2.351424320688789],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    exterior: {
      position: [1.003572766898403, 3.5336761869366797, 1.9778968765932783],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
  },
  tablet: {
    interior: {
      position: [0.9080488874565018, -6.155680329175703, 3.054301013169183],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    exterior: {
      position: [1.0896386906179043, 6.5840493025961395, 1.333295754767758],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    intermediate: {
      position: [-5.480077250921402, 0.11091615877318138, 2.4091204915233346],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
  },
  phone: {
    interior: {
      position: [0.9080488874565105, -3.366425992671914, 2.148017341436057],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    intermediate: {
      position: [-2.4443003885814094, 0.08658094024337017, 2.351424320688789],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
    exterior: {
      position: [1.003572766898403, 3.5336761869366797, 1.9778968765932783],
      target: [0.9080488874564873, 0.058943422061014494, 1.0350473517155412],
    },
  },
};

let interiorCameraPos = [
  0.9080488874565105, -3.366425992671914, 2.148017341436057,
];
let interiorCameraTarget = [
  0.9080488874564873, 0.058943422061014494, 1.0350473517155412,
];
let exteriorCameraPos = [
  1.003572766898403, 3.5336761869366797, 1.9778968765932783,
];
let exteriorCameraTarget = [
  0.9080488874564873, 0.058943422061014494, 1.0350473517155412,
];

const materialChannels = {
  AOPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  AlbedoPBR: { type: "color" },
  Anisotropy: { type: "number", min: 0, max: 1, step: 0.01 },
  BumpMap: { type: "file" },
  CavityPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  ClearCoat: { type: "number", min: 0, max: 1, step: 0.01 },
  ClearCoatNormalMap: { type: "file" },
  ClearCoatRoughness: { type: "number", min: 0, max: 1, step: 0.01 },
  DiffuseColor: { type: "color" },
  DiffuseIntensity: { type: "number", min: 0, max: 1, step: 0.01 },
  DiffusePBR: { type: "color" },
  Displacement: { type: "file" },
  EmitColor: { type: "color" },
  GlossinessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  Matcap: { type: "file" },
  MetalnessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  NormalMap: { type: "file" },
  Opacity: { type: "number", min: 0, max: 1, step: 0.01 },
  RoughnessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularColor: { type: "color" },
  SpecularF0: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularHardness: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  SubsurfaceScattering: { type: "number", min: 0, max: 1, step: 0.01 },
  SubsurfaceTranslucency: { type: "number", min: 0, max: 1, step: 0.01 },
};

const myMaterialsv2 = [
  { name: "Interior", channels: {} }, // Example material
];

// Function to show the correct page and hide others
function navigateTo(page) {
  // Hide all pages
  const pages = document.querySelectorAll(".page1, .page2, .page3, .page4");
  pages.forEach((p) => (p.style.display = "none"));

  // Show the selected page
  document.querySelector(`.${page}`).style.display = "block";
}

// Set initial page to show (e.g., page1)
navigateTo("page1");

document
  .querySelector(".page1 .nav-item.left")
  .addEventListener("click", () => navigateTo("page4")); // Going left from page1 to page4

document
  .querySelector(".page1 .nav-item.right")
  .addEventListener("click", () => navigateTo("page2")); // Going right from page1 to page2

// Page 2: Exterior Color navigation
document
  .querySelector(".page2 .nav-item.left")
  .addEventListener("click", () => navigateTo("page1")); // Going left from page2 to page1

document
  .querySelector(".page2 .nav-item.right")
  .addEventListener("click", () => navigateTo("page3")); // Going right from page2 to page3

// Page 3: Hardware Color navigation
document
  .querySelector(".page3 .nav-item.left")
  .addEventListener("click", () => navigateTo("page2")); // Going left from page3 to page2

document
  .querySelector(".page3 .nav-item.right")
  .addEventListener("click", () => navigateTo("page4")); // Going right from page3 to page4

// Page 4: Grille Pattern navigation
document
  .querySelector(".page4 .nav-item.left")
  .addEventListener("click", () => navigateTo("page3")); // Going left from page4 to page3

document
  .querySelector(".page4 .nav-item.right")
  .addEventListener("click", () => navigateTo("page1")); // Going right from page4 to page1
const interiorColors = {
  white: "#f3f4f5",
  // black: "#16151c",
  // black: "#0d0d0d",
  black: "#000000",
  brown: "#514431",
  tan: "#c8baa5",
  // "morning-sky-gray": "#cecfd0",
  "morning-sky-gray": "#a2a0a0",
};

function hexToRgbArray(hex) {
  // Remove "#" if present
  console.log(`hextoRGBArray input : ${hex}`);
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
  prairie: [457, 1058],
  traditional: [658, 1235],
  topRow: [558, 1159],
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
  console.log(`Device is ${deviceType()}`);
  logAllParts(api);
  getSliderWorldCoordinates(api);
  hideAllGrills();
  // Show the default grill (Traditional, for instance)
  showGrillType("traditional");
  logAllMaterials(api);
  if (deviceType() == "tablet") {
    console.log("Setting tab to tab interior");
    api.setCameraLookAt(
      cameraSettings.tablet.interior.position,
      cameraSettings.tablet.interior.target,
      2,
      (err) => {
        if (!err) {
          console.log("Camera moved successfully!");
        } else {
          console.error("Error setting camera:", err);
        }
      }
    );
  }

  initializeMaterialEditor();
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
    case "none":
      // hideAllGrills();
      console.log("Hidden all grils");
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
  element.addEventListener("click", interiorColorSelectHandler);
});

function interiorColorSelectHandler(event) {
  focusInterior();
  console.log(`Button pressed : ${event.target}`);
  const selectedColor = event.target.getAttribute("data-color");
  console.log(`Selected color : ${selectedColor}`);

  interiorColor = selectedColor;

  // Remove the 'selected' class from all color buttons
  document.querySelectorAll(".interior-color").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked color button
  event.target.classList.add("selected");
  setColor("Interior", interiorColors[interiorColor]);
  if (interiorColor === "white") {
    // showAllExteriorColors();
    console.log("No need to disable any Exterior colors");
    updateExteriorColorOptions(interiorColor);
  } else {
    // Otherwise, show only the exterior colors that match the interior color
    updateExteriorColorOptions(interiorColor);
    setColor("Exterior", interiorColors[interiorColor]);
  }
}

function showAllExteriorColors() {
  // Show all exterior color circles
  const exteriorColorCircles = document.querySelectorAll(".exterior-color");
  exteriorColorCircles.forEach((circle) => {
    circle.style.display = "inline-block";
  });
}
document.querySelectorAll(".exterior-color").forEach((element) => {
  element.addEventListener("click", exteriorColorSelectHandler);
});

// function updateExteriorColorOptions(selectedInteriorColor) {
//   const exteriorColorCircles = document.querySelectorAll(".exterior-color");

//   exteriorColorCircles.forEach((circle) => {
//     const exteriorColor = circle.getAttribute("data-color");

//     // If the interior color is not white, match the exterior colors to the selected interior color
//     if (selectedInteriorColor === exteriorColor) {
//       console.log(
//         `for interior : ${selectedInteriorColor} and exterior: ${exteriorColor} decision is same`
//       );
//       // Show the matching exterior color
//       circle.style.display = "inline-block";
//     } else {
//       // Hide the non-matching exterior colors
//       circle.style.display = "none";
//     }
//   });
// }

function updateExteriorColorOptions(selectedInteriorColor) {
  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("blocked-overlay");
  });
  const exteriorColorCircles = document.querySelectorAll(".exterior-color");
  if (selectedInteriorColor == "white") {
    exteriorColorCircles.forEach((circle) => {
      const exteriorColor = circle.getAttribute("data-color");
      circle.style.opacity = "1";
      circle.style.pointerEvents = "auto";
      circle.style.filter = "none";
    });
    document.querySelectorAll(".exterior-color").forEach((button) => {
      button.classList.remove("selected");
    });
  } else {
    exteriorColorCircles.forEach((circle) => {
      const exteriorColor = circle.getAttribute("data-color");
      if (selectedInteriorColor === exteriorColor) {
        console.log(
          `For interior: ${selectedInteriorColor} and exterior: ${exteriorColor}, the decision is the same`
        );
        // Enable the matching exterior color
        document.querySelectorAll(".exterior-color").forEach((button) => {
          button.classList.remove("selected");
        });

        // Add the 'selected' class to the clicked color button

        document.querySelectorAll(".exterior-color").forEach((button) => {
          console.log("Inside the query selector");
          console.log(
            `data-color attr= ${button.getAttribute(
              "data-color"
            )}  and selectedInternalColor = ${selectedInteriorColor}`
          );
          if (button.getAttribute("data-color") === selectedInteriorColor) {
            button.classList.add("selected");
          } else {
            button.classList.add("blocked-overlay");
          }
        });

        console.log("Current focus statement executed ? ");
        circle.style.opacity = "1";
        circle.style.pointerEvents = "auto";
        circle.style.filter = "none"; // Reset any disabled styles
      } else {
        // Disable the non-matching exterior colors
        // circle.style.opacity = "0.5"; // Visual indication of being disabled
        circle.style.pointerEvents = "none"; // Makes it unclickable
        // circle.style.filter = "grayscale(100%)"; // Optional visual cue
        // circle.classList.add("blocked-overlay");
      }
    });
  }
  // exteriorColorCircles.forEach((circle) => {
  //   const exteriorColor = circle.getAttribute("data-color");

  //   if (
  //     selectedInteriorColor == "white" ||
  //     selectedInteriorColor === exteriorColor
  //   ) {
  //     console.log(
  //       `For interior: ${selectedInteriorColor} and exterior: ${exteriorColor}, the decision is the same`
  //     );
  //     // Enable the matching exterior color
  //     circle.style.opacity = "1";
  //     circle.style.pointerEvents = "auto";
  //     circle.style.filter = "none"; // Reset any disabled styles
  //   } else {
  //     // Disable the non-matching exterior colors
  //     circle.style.opacity = "0.5"; // Visual indication of being disabled
  //     circle.style.pointerEvents = "none"; // Makes it unclickable
  //     circle.style.filter = "grayscale(100%)"; // Optional visual cue
  //   }
  // });
}

function exteriorColorSelectHandler(event) {
  focusExterior();
  const selectedColor = event.target.getAttribute("data-color");
  console.log(`Selected color : ${selectedColor}`);
  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked color button
  event.target.classList.add("selected");
  exteriorColor = selectedColor;
  setColor("Exterior", interiorColors[exteriorColor]);
}

// Function to update available exterior color options based on the selected interior colo

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
// const lockButtons = document.querySelectorAll(".lock-button");

// lockButtons.forEach((button) => {
//   button.addEventListener("click", (e) => {
//     const selectedLockColor = e.target.style.backgroundColor;
//     console.log(`Lock (Handle) color selected: ${selectedLockColor}`);
//     updateLockButtonStyles(e.target);
//   });
// });

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
// function updateLockButtonStyles(selectedButton) {
//   lockButtons.forEach((button) => {
//     button.classList.remove("border-4", "border-blue-500");
//   });
//   selectedButton.classList.add("border-4", "border-blue-500");
// }

// Function to handle color selection and apply material customization
document.querySelectorAll(".lock-button, .hardware-color").forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedColor = event.target.getAttribute("data-color");
    const hex = event.target.getAttribute("hex");
    document.querySelectorAll(".hardware-color").forEach((button) => {
      button.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked color button
    event.target.classList.add("selected");
    if (hex) {
      // If the element has a hex attribute, create a customColor object
      const customColor = {
        hex: hex,
        name: selectedColor,
        metalness: parseFloat(event.target.getAttribute("metalness")) || 0,
        glossiness: parseFloat(event.target.getAttribute("glossiness")) || 0,
        roughness: parseFloat(event.target.getAttribute("roughness")) || 0,
        specular: parseFloat(event.target.getAttribute("specular")) || 0,
      };

      // Pass the customColor object to applyGeneralColor
      applyGeneralColor(customColor);
    } else {
      // Fallback to the original switch-case logic for buttons without a hex attribute
      switch (selectedColor) {
        case "bright-brass":
          applyBrightBrassColor();
          break;
        case "morning-sky-gray":
          applyMorningSkyGrayColor();
          break;
        case "oil-rubbed-bronze":
          applyOilRubbedBronzeColor();
          break;
        case "satin-nickel":
          applySatinNickelColor();
          break;
        case "white":
          applyWhiteColor();
          break;
        default:
          console.log("Unknown color selected");
      }
    }
  });
});

// Function for "Bright Brass" color
// Function to apply Bright Brass customizations
function applyBrightBrassColor() {
  console.log("Applying Bright Brass Customization");

  // Loop through the materials to find "HandleMaterial"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set DiffuseColor (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      234 / 255,
      221 / 255,
      112 / 255,
    ]; // RGB to [0, 1] range for Bright Brass

    // Set GlossinessPBR (shininess)
    materialToChange.channels.GlossinessPBR.factor = 0.85; // High gloss for Bright Brass

    // Set MetalnessPBR (reflectivity)
    materialToChange.channels.MetalnessPBR.factor = 0.9; // High metalness for a metallic look

    // Optionally, you could adjust other channels as well, e.g., Specular, Roughness, etc.
    materialToChange.channels.RoughnessPBR.factor = 0.2; // Low roughness for a smooth, shiny surface

    // Optionally, adjust SpecularPBR or other channels for more realistic material effects
    materialToChange.channels.SpecularPBR.factor = 0.9; // High specularity to simulate shiny surface

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Bright Brass material updated successfully");
    });
  } else {
    console.log("HandleMaterial not found");
  }
}

// Function for "Morning Sky Gray" color
function applyMorningSkyGrayColor() {
  console.log("Applying Morning Sky Gray Customization");

  // Loop through the materials to find "HandleMaterial"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set AlbedoPBR (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      188 / 255, // R value for Morning Sky Gray
      188 / 255, // G value for Morning Sky Gray
      188 / 255, // B value for Morning Sky Gray
    ]; // RGB to [0, 1] range
    // materialToChange.channels.AlbedoPBR.color = hexToRgbArray(
    //   interiorColors["morning-sky-gray"]
    // );

    // Set GlossinessPBR (shininess) - low gloss for matte plastic
    materialToChange.channels.GlossinessPBR.factor = 0.25; // Matte finish

    // Set MetalnessPBR (reflectivity) - low metalness for a matte plastic
    materialToChange.channels.MetalnessPBR.factor = 0.3; // Slight metallic, but still mainly plastic

    // Set RoughnessPBR (smoothness) - high roughness for matte finish
    materialToChange.channels.RoughnessPBR.factor = 0.75; // Rough surface for matte plastic

    // Set SpecularPBR (reflectivity) - low specularity for matte finish
    materialToChange.channels.SpecularPBR.factor = 0.3; // Lower specularity to simulate matte

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Morning Sky Gray material updated successfully");
    });
  } else {
    console.log("HandleMaterial not found");
  }
}

// Function for "Oil Rubbed Bronze" color
function applyOilRubbedBronzeColor() {
  console.log("Applying Oil Rubbed Bronze Customization");

  // Loop through the materials to find "HandleMaterial"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set AlbedoPBR (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      59 / 255, // R value for Oil Rubbed Bronze
      56 / 255, // G value for Oil Rubbed Bronze
      51 / 255, // B value for Oil Rubbed Bronze
    ]; // RGB to [0, 1] range

    // Set GlossinessPBR (shininess) - slightly reflective, but still matte
    materialToChange.channels.GlossinessPBR.factor = 0.4; // Moderate gloss for slightly reflective finish

    // Set MetalnessPBR (reflectivity) - high metalness for aged bronze effect
    materialToChange.channels.MetalnessPBR.factor = 0.7; // High metalness to reflect the bronze nature

    // Set RoughnessPBR (smoothness) - matte but slightly smooth
    materialToChange.channels.RoughnessPBR.factor = 0.55; // Slight roughness for matte bronze look

    // Set SpecularPBR (reflectivity) - moderate specularity for subtle reflections
    materialToChange.channels.SpecularPBR.factor = 0.5; // Moderate specularity to simulate slight reflections

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Oil Rubbed Bronze material updated successfully");
    });
  } else {
    console.log("HandleMaterial not found");
  }
}

// Function for "Satin Nickel" color
function applyGeneralColor(customColor) {
  console.log(`custom color in apply general ${customColor}`);
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }
  let rgb = hexToRgbArray(customColor.hex);
  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = rgb;

    if (customColor?.glossiness !== undefined) {
      materialToChange.channels.GlossinessPBR.factor = customColor.glossiness;
    }
    if (customColor?.metalness !== undefined) {
      materialToChange.channels.MetalnessPBR.factor = customColor.metalness;
    }
    if (customColor?.roughness !== undefined) {
      materialToChange.channels.RoughnessPBR.factor = customColor.roughness;
    }
    if (customColor?.specular !== undefined) {
      materialToChange.channels.SpecularPBR.factor = customColor.specular;
    }

    api.setMaterial(materialToChange, function () {
      console.log(`${customColor.name} material updated successfully`);
    });
  } else {
    console.log("HandleMaterial not found");
  }
}
function applySatinNickelColor() {
  console.log("Applying Satin Nickel Customization");

  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      210 / 255, // Light silver base
      210 / 255,
      205 / 255,
    ];

    materialToChange.channels.EmitColor = {
      enable: true,
      color: [220 / 255, 220 / 255, 220 / 255], // Soft silver glow
      factor: 0.2, // Subtle emission, not overpowering
    };

    materialToChange.channels.GlossinessPBR.factor = 0.95; // Higher glossiness
    materialToChange.channels.MetalnessPBR.factor = 1; // Fully metallic
    materialToChange.channels.RoughnessPBR.factor = 0.05; // Very smooth and shiny
    materialToChange.channels.SpecularPBR.factor = 0.9; // High specular reflection

    api.setMaterial(materialToChange, function () {
      console.log("Satin Nickel material updated successfully");
    });
  } else {
    console.log("HandleMaterial not found");
  }
}

// Function for "White" color
function applyWhiteColor() {
  console.log("Applying White Customization");

  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "HandleMaterial") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      238 / 255,
      235 / 255,
      236 / 255,
    ];

    materialToChange.channels.GlossinessPBR.factor = 0.3; // Less glossy, more matte
    materialToChange.channels.MetalnessPBR.factor = 0.1; // Low reflectivity
    materialToChange.channels.RoughnessPBR.factor = 0.75; // More rough for matte finish
    materialToChange.channels.SpecularPBR.factor = 0.4; // Less specular for a more diffused reflection

    api.setMaterial(materialToChange, function () {
      console.log("White material updated successfully");
    });
  } else {
    console.log("HandleMaterial not found");
  }
}

document.querySelectorAll(".grille-option").forEach((option) => {
  option.addEventListener("click", (event) => {
    // Get the value of the data-pattern attribute
    const pattern = option.getAttribute("data-pattern");
    showGrillType(pattern);

    // Remove the 'selected' class from all options
    document.querySelectorAll(".grille-option").forEach((option) => {
      option.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked option
    option.classList.add("selected");

    // Log the selected pattern
    console.log(`Selected grille pattern: ${pattern}`);
  });
});

document.querySelectorAll(".nav-item.center").forEach((element) => {
  element.addEventListener("click", (event) => {
    const selectedColor = "white";
    const extColor = "black";
    console.log(`Selected color : ${selectedColor}`);

    interiorColor = selectedColor;

    // Remove the 'selected' class from all color buttons
    document.querySelectorAll(".interior-color").forEach((button) => {
      button.classList.remove("selected");
    });

    setColor("Interior", interiorColors[interiorColor]);
    updateExteriorColorOptions(selectedColor);
    setColor("Exterior", interiorColors[extColor]);
    document.querySelectorAll(".hardware-color").forEach((button) => {
      button.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked color button
    applyWhiteColor();
    const pattern = "traditional";
    hideAllGrills();
    showGrillType(pattern);

    // Remove the 'selected' class from all options
    document.querySelectorAll(".grille-option").forEach((option) => {
      option.classList.remove("selected");
    });

    api.recenterCamera(function (err) {
      if (!err) {
        console.log("Camera recentered");
      }
    });
  });
});

// function focusExterior() {
//   let exteriorCameraPos = [
//     1.003572766898403, 3.5336761869366797, 1.9778968765932783,
//   ];
//   let exteriorCameraTarget = [
//     0.9080488874564873, 0.058943422061014494, 1.0350473517155412,
//   ];
//   api.setCameraLookAt(
//     exteriorCameraPos,
//     exteriorCameraTarget,
//     2,
//     function (err) {
//       if (err) console.error(err);
//     }
//   );
// }

// function focusInterior() {
//   let interiorCameraPos = [
//     0.9080488874565105, -3.366425992671914, 2.148017341436057,
//   ];
//   let interiorCameraTarget = [
//     0.9080488874564873, 0.058943422061014494, 1.0350473517155412,
//   ];
//   api.setCameraLookAt(
//     interiorCameraPos,
//     interiorCameraTarget,
//     2,
//     function (err) {
//       if (err) console.error(err);
//     }
//   );
// }

function deviceType() {
  const width = window.innerWidth;

  if (width <= 768) {
    console.log("phone");
    return "phone";
  } else if (width > 768 && width <= 1200) {
    console.log("tablet");
    return "tablet";
  } else {
    console.log("laptop");
    return "laptop";
  }
}

function isNearPosition(currentPos, targetPos, threshold = 0.05) {
  return (
    Math.abs(currentPos[0] - targetPos[0]) < threshold &&
    Math.abs(currentPos[1] - targetPos[1]) < threshold &&
    Math.abs(currentPos[2] - targetPos[2]) < threshold
  );
}
function focusExterior() {
  // Get the current device type (laptop or tablet)
  const device = deviceType(); // Returns either 'laptop' or 'tablet'

  // Get the camera settings for the current device
  const exterior = cameraSettings[device].exterior;
  const interior = cameraSettings[device].interior;
  const intermediate = cameraSettings[device].intermediate;

  // Get the current camera position and target
  api.getCameraLookAt(function (err, camera) {
    if (err) {
      console.error(err);
      return;
    }

    const currentPosition = camera.position;

    // Check if the current camera is near the interior position
    if (isNearPosition(currentPosition, interior.position)) {
      console.log(
        "Dest:Exterior Initial:Near Interior Path:Intermediate needed"
      );
      setCamera(intermediate.position, intermediate.target, 1);
      setTimeout(delayedExterior, 700);
    } else {
      setCamera(exterior.position, exterior.target, 2);
    }
  });
}
function delayedExterior() {
  const exterior = cameraSettings[deviceType()].exterior;
  setCamera(exterior.position, exterior.target, 1);
}

// Function to focus on the interior, with checks for intermediate position
function focusInterior() {
  // Get the current device type (laptop or tablet)
  const device = deviceType(); // Returns either 'laptop' or 'tablet'

  // Get the camera settings for the current device
  const interior = cameraSettings[device].interior;
  const exterior = cameraSettings[device].exterior;
  const intermediate = cameraSettings[device].intermediate;

  // Get the current camera position and target
  api.getCameraLookAt(function (err, camera) {
    if (err) {
      console.error(err);
      return;
    }

    const currentPosition = camera.position;

    // Check if the current camera is near the exterior position
    if (isNearPosition(currentPosition, exterior.position)) {
      console.log(
        "Dest:Interior Initial:Near Exterior Path:Intermediate needed"
      );
      setCamera(intermediate.position, intermediate.target, 1);
      setTimeout(delayedInterior, 700);
    } else {
      setCamera(interior.position, interior.target, 2);
    }
  });
}
function delayedInterior() {
  const interior = cameraSettings[deviceType()].interior;
  setCamera(interior.position, interior.target, 1);
}

function setCamera(position, target, duration = 2, callback) {
  api.setCameraLookAt(position, target, duration, function (err) {
    if (err) {
      console.error("Error setting camera:", err);
    }
    if (callback) {
      callback();
    }
  });
}

// Hook up buttons to camera settings
document.getElementById("interiorBtn").addEventListener("click", function () {
  const interior = cameraSettings.laptop.interior;
  setCamera(interior.position, interior.target);
});

document.getElementById("exteriorBtn").addEventListener("click", function () {
  const exterior = cameraSettings.laptop.exterior;
  setCamera(exterior.position, exterior.target);
});

document
  .getElementById("intermediateBtn")
  .addEventListener("click", function () {
    const intermediate = cameraSettings.laptop.intermediate;
    setCamera(intermediate.position, intermediate.target);
  });

document.getElementById("setCamera").addEventListener("click", function () {
  // Retrieve input values
  const position = [
    parseFloat(document.getElementById("cameraX").value) || 0,
    parseFloat(document.getElementById("cameraY").value) || 0,
    parseFloat(document.getElementById("cameraZ").value) || 0,
  ];
  const target = [
    parseFloat(document.getElementById("targetX").value) || 0,
    parseFloat(document.getElementById("targetY").value) || 0,
    parseFloat(document.getElementById("targetZ").value) || 0,
  ];

  // Call the API to set the camera position
  api.setCameraLookAt(position, target, 2, function (err) {
    if (!err) {
      console.log("Camera moved to:", position, "Targeting:", target);
    } else {
      console.error("Error setting camera:", err);
    }
  });
});

// Event Listener for "Get Position" Button
document.getElementById("getPosition").addEventListener("click", function () {
  // Call the API to get the current camera position and target
  api.getCameraLookAt(function (err, camera) {
    if (!err) {
      console.log("Current Camera Position:", camera.position);
      console.log("Current Camera Target:", camera.target);
    } else {
      console.error("Error getting camera position:", err);
    }
  });
});

function createMaterialInput(name, options) {
  const container = document.createElement("div");
  container.classList.add("material-input");

  const label = document.createElement("label");
  label.textContent = name;

  const input = document.createElement("input");
  input.name = name;

  if (options.type === "number" || options.type === "range") {
    input.type = "range";
    input.min = options.min;
    input.max = options.max;
    input.step = options.step;
  } else {
    input.type = options.type;
  }

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

function initializeMaterialEditor() {
  const container = document.getElementById("input-container");
  Object.entries(materialChannels).forEach(([name, options]) => {
    const inputElement = createMaterialInput(name, options);

    // Add event listener to automatically update the material
    inputElement.addEventListener("input", (event) => {
      updateMaterial(name, event.target.value, options.type);
    });

    container.appendChild(inputElement);
  });
}

// Function to update material based on changes
function updateMaterial(channelName, value, type) {
  console.log(
    `Update Material for channel:${channelName} val:${value} type:${type}`
  );
  let materialToChange;

  // Find the material you want to update
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name == "Interior") {
      materialToChange = m;
      console.log(`Material to Change has been found`);
    }
  }

  if (!materialToChange) {
    console.error("Material not found!");
    return;
  }

  // Update the material's channel based on input type
  if (type === "color") {
    console.log("Type = color , value = ");
    console.log(value);
    materialToChange.channels[channelName] = {
      factor: 1,
      enable: true,
      color: hexToRgbArray(value),
      // color: value,
    };
  } else if (type === "number") {
    materialToChange.channels[channelName] = {
      factor: parseFloat(value),
      enable: true,
    };
  }

  // Apply the changes to the model
  api.setMaterial(materialToChange);
}

function parseHexToRgbArray(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
