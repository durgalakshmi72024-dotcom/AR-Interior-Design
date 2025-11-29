// ----- DOM ELEMENTS -----
const roomTypeSelect = document.getElementById("roomType");
const roomImageInput = document.getElementById("roomImageInput");
const roomImage = document.getElementById("roomImage");
const roomContainer = document.getElementById("roomContainer");

const wallOptions = document.getElementById("wallOptions");
const floorOptions = document.getElementById("floorOptions");
const lightOptions = document.getElementById("lightOptions");
const furnitureOptions = document.getElementById("furnitureOptions");

const summaryRoom = document.getElementById("summaryRoom");
const selectedFurnitureList = document.getElementById(
  "selectedFurnitureList"
);
const furnitureCostSpan = document.getElementById("furnitureCost");
const materialCostSpan = document.getElementById("materialCost");
const labourCostSpan = document.getElementById("labourCost");
const totalCostSpan = document.getElementById("totalCost");

// ----- OVERLAY ELEMENTS -----
const wallOverlay = document.createElement("div");
wallOverlay.className = "wall-overlay";

const floorOverlay = document.createElement("div");
floorOverlay.className = "floor-overlay";

const lightOverlay = document.createElement("div");
lightOverlay.className = "light-overlay";

roomContainer.appendChild(wallOverlay);
roomContainer.appendChild(floorOverlay);
roomContainer.appendChild(lightOverlay);

// will hold furniture overlay <img> elements
let furnitureOverlayEls = [];

// ----- STATE -----
let selectedWall = WALL_PRESETS[0];
let selectedFloor = FLOOR_PRESETS[0];
let selectedLight = LIGHT_PRESETS[0];
let selectedFurnitureSet = null;

// ----- HELPERS -----
function createChip(container, presetList, renderFn, isColor = false) {
  container.innerHTML = "";

  presetList.forEach((preset, index) => {
    const btn = document.createElement("button");
    btn.className = "chip";

    if (isColor) {
      const swatch = document.createElement("span");
      swatch.className = "chip-color-swatch";
      swatch.style.background = preset.color;

      const label = document.createElement("span");
      label.textContent = preset.label;

      const wrap = document.createElement("span");
      wrap.className = "chip-color";
      wrap.appendChild(swatch);
      wrap.appendChild(label);

      btn.appendChild(wrap);
    } else {
      btn.textContent = preset.label;
    }

    if (index === 0) {
      btn.classList.add("active");
      renderFn(preset);
    }

    btn.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach(c =>
        c.classList.remove("active")
      );
      btn.classList.add("active");
      renderFn(preset);
    });

    container.appendChild(btn);
  });
}

// ----- APPLY FUNCTIONS -----
function applyWall(preset) {
  selectedWall = preset;
  wallOverlay.style.background = preset ? preset.color : "transparent";
  updateSummary();
  updateCosts();
}

function applyFloor(preset) {
  selectedFloor = preset;
  if (!preset) {
    floorOverlay.style.backgroundImage = "none";
  } else {
    floorOverlay.style.backgroundImage = `url('${preset.image}')`;
  }
  updateSummary();
  updateCosts();
}

function applyLight(preset) {
  selectedLight = preset;
  if (!preset || preset.type === "none") {
    lightOverlay.style.background = "transparent";
  } else if (preset.type === "warm") {
    lightOverlay.style.background =
      "radial-gradient(circle at top, rgba(255, 210, 170, 0.75), transparent 65%)";
  } else if (preset.type === "cool") {
    lightOverlay.style.background =
      "radial-gradient(circle at top, rgba(180, 220, 255, 0.8), transparent 65%)";
  } else if (preset.type === "moody") {
    lightOverlay.style.background =
      "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 40%, rgba(0,0,0,0.8))";
  }
  updateSummary();
}

function applyFurnitureSet(preset) {
  selectedFurnitureSet = preset;

  // remove old overlays
  furnitureOverlayEls.forEach(el => el.remove());
  furnitureOverlayEls = [];

  if (!preset) {
    selectedFurnitureList.innerHTML = "<p>No furniture selected.</p>";
    updateCosts();
    return;
  }

  // create overlays
  preset.overlays.forEach(cfg => {
    const img = document.createElement("img");
    img.src = cfg.image;
    img.className = "furniture-overlay";
    img.style.left = cfg.left;
    img.style.bottom = cfg.bottom;
    roomContainer.appendChild(img);
    furnitureOverlayEls.push(img);
  });

  // list in summary panel
  selectedFurnitureList.innerHTML = "";
  preset.items.forEach(item => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `<span>${item.name}</span><span>₹${item.price}</span>`;
    selectedFurnitureList.appendChild(row);
  });

  updateCosts();
}

// ----- COST CALC -----
function updateCosts() {
  // furniture
  let furnitureCost = 0;
  if (selectedFurnitureSet) {
    selectedFurnitureSet.items.forEach(item => {
      furnitureCost += item.price;
    });
  }

  // simple formula for material cost depending on wall + floor selection
  const wallBase = selectedWall ? 15000 : 0;
  const floorBase = selectedFloor ? 20000 : 0;
  const materialCost = wallBase + floorBase;

  const subtotal = furnitureCost + materialCost;
  const labour = Math.round(subtotal * 0.2);
  const total = subtotal + labour;

  furnitureCostSpan.textContent = furnitureCost;
  materialCostSpan.textContent = materialCost;
  labourCostSpan.textContent = labour;
  totalCostSpan.textContent = total;
}

// ----- SUMMARY TEXT -----
function updateSummary() {
  const roomType = roomTypeSelect.value;
  const roomLabelMap = {
    living: "Living Room",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom"
  };

  summaryRoom.innerHTML = `
    <p><strong>Room:</strong> ${roomLabelMap[roomType]}</p>
    <p><strong>Wall:</strong> ${selectedWall ? selectedWall.label : "None"}</p>
    <p><strong>Flooring:</strong> ${selectedFloor ? selectedFloor.label : "None"}</p>
    <p><strong>Lighting:</strong> ${selectedLight ? selectedLight.label : "Normal"}</p>
    <p><strong>Furniture Set:</strong> ${
      selectedFurnitureSet ? selectedFurnitureSet.label : "None"
    }</p>
  `;
}

// ----- INIT CONTROL CHIPS -----
createChip(wallOptions, WALL_PRESETS, applyWall, true);
createChip(floorOptions, FLOOR_PRESETS, applyFloor);
createChip(lightOptions, LIGHT_PRESETS, applyLight);

// furniture chips depend on room type
function refreshFurnitureOptions() {
  const roomType = roomTypeSelect.value;
  const optionsForRoom = FURNITURE_SETS.filter(
    set => set.roomType === roomType
  );

  furnitureOptions.innerHTML = "";

  if (optionsForRoom.length === 0) {
    furnitureOptions.textContent = "No presets for this room yet.";
    selectedFurnitureSet = null;
    applyFurnitureSet(null);
    return;
  }

  optionsForRoom.forEach((set, index) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = set.label;

    if (index === 0) {
      btn.classList.add("active");
      applyFurnitureSet(set);
    }

    btn.addEventListener("click", () => {
      furnitureOptions.querySelectorAll(".chip").forEach(c =>
        c.classList.remove("active")
      );
      btn.classList.add("active");
      applyFurnitureSet(set);
    });

    furnitureOptions.appendChild(btn);
  });
}

refreshFurnitureOptions();
updateSummary();
updateCosts();

// ----- ROOM TYPE CHANGE -----
roomTypeSelect.addEventListener("change", () => {
  refreshFurnitureOptions();
  updateSummary();
});

// ----- IMAGE UPLOAD -----
roomImageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt => {
    roomImage.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});
