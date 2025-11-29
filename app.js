// ===== DOM REFERENCES =====
const roomTypeSelect = document.getElementById("roomType");
const roomImageInput = document.getElementById("roomImageInput");
const roomImage = document.getElementById("roomImage");
const roomCanvas = document.getElementById("roomCanvas");

const wallOverlay = document.getElementById("wallOverlay");
const wallOptionsEl = document.getElementById("wallOptions");

const productStrip = document.getElementById("productStrip");
const productCategorySelect = document.getElementById("productCategory");

const selectedList = document.getElementById("selectedList");
const furnitureCostSpan = document.getElementById("furnitureCost");
const wallCostSpan = document.getElementById("wallCost");
const labourCostSpan = document.getElementById("labourCost");
const totalCostSpan = document.getElementById("totalCost");

// toolbar & top bar buttons (if they exist)
const btnRedesign = document.getElementById("btnRedesign");
const btnCenterCamera = document.getElementById("btnCenterCamera");
const btnDownload = document.getElementById("btnDownload");
const btnZoomIn = document.getElementById("btnZoomIn");
const btnZoomOut = document.getElementById("btnZoomOut");
const btnClear = document.getElementById("btnClear");
const btnMirror = document.getElementById("btnMirror");
const btnMore = document.getElementById("btnMore");
const btnPrevDesign = document.getElementById("btnPrevDesign");
const btnNextDesign = document.getElementById("btnNextDesign");
const linkMyDesigns = document.getElementById("linkMyDesigns");
const linkHelp = document.getElementById("linkHelp");
const linkUser = document.getElementById("linkUser");

// ===== STATE =====
// mirrored = left/right flip
let placedOverlays = []; // { item, el, widthPercent, angle, mirrored }
let selectedOverlay = null;
let selectedWall = WALL_OPTIONS[0]; // from data.js

// ===== ROOM IMAGE UPLOAD =====
if (roomImageInput) {
  roomImageInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      roomImage.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ===== WALL OPTIONS =====
function renderWallOptions() {
  wallOptionsEl.innerHTML = "";
  WALL_OPTIONS.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    if (index === 0) btn.classList.add("active");

    const swatch = document.createElement("span");
    swatch.className = "chip-color-swatch";
    swatch.style.background = opt.color;

    const label = document.createElement("span");
    label.textContent = opt.label;

    btn.appendChild(swatch);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      wallOptionsEl
        .querySelectorAll(".chip")
        .forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      selectedWall = opt;
      applyWallOption();
      updateCosts();
    });

    wallOptionsEl.appendChild(btn);

    if (index === 0) {
      selectedWall = opt;
      applyWallOption();
    }
  });
}

function applyWallOption() {
  if (!wallOverlay) return;
  wallOverlay.style.backgroundColor = selectedWall.color;
}

// ===== PRODUCTS (RIGHT SIDE) =====
function renderProducts() {
  if (!productStrip) return;
  const roomType = roomTypeSelect.value;
  const category = productCategorySelect.value;

  productStrip.innerHTML = "";

  const filtered = PRODUCTS.filter(p => {
    if (p.roomType !== roomType) return false;
    if (category === "all") return true;
    return p.category === category;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    const nameEl = document.createElement("h3");
    nameEl.textContent = item.name;

    const priceEl = document.createElement("p");
    priceEl.textContent = "₹" + item.price;

    const btn = document.createElement("button");
    btn.textContent = "Add to room";
    btn.addEventListener("click", () => addItemToRoom(item));

    card.appendChild(img);
    card.appendChild(nameEl);
    card.appendChild(priceEl);
    card.appendChild(btn);

    productStrip.appendChild(card);
  });

  if (filtered.length === 0) {
    productStrip.textContent = "No items defined for this room and category.";
  }
}

// ===== TRANSFORM HELPER (rotate + mirror) =====
function applyTransform(entry) {
  const angle = entry.angle || 0;
  const scaleX = entry.mirrored ? -1 : 1;
  entry.el.style.transform = `scaleX(${scaleX}) rotate(${angle}deg)`;
}

// ===== ADD FURNITURE TO ROOM =====
function addItemToRoom(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "furniture-overlay";
  wrapper.dataset.angle = "0";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.name;

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";

  const rotateHandle = document.createElement("div");
  rotateHandle.className = "rotate-handle";

  wrapper.appendChild(img);
  wrapper.appendChild(resizeHandle);
  wrapper.appendChild(rotateHandle);

  const baseWidth = 14; // 14% of canvas width
  wrapper.style.width = baseWidth + "%";

  const leftPercent = 10 + Math.random() * 70;
  wrapper.style.left = leftPercent + "%";
  wrapper.style.bottom = "6%";

  makeDraggable(wrapper);
  makeResizable(wrapper, resizeHandle);
  makeRotatable(wrapper, rotateHandle);
  makeSelectable(wrapper);

  roomCanvas.appendChild(wrapper);

  const entry = {
    item,
    el: wrapper,
    widthPercent: baseWidth,
    angle: 0,
    mirrored: false
  };
  placedOverlays.push(entry);

  applyTransform(entry); // initial

  setSelectedOverlay(wrapper);
  updateSelectedSummary();
  updateCosts();
}

// ===== DRAGGING =====
function makeDraggable(el) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startBottom = 0;

  el.addEventListener("mousedown", e => {
    if (
      e.target.classList.contains("resize-handle") ||
      e.target.classList.contains("rotate-handle")
    )
      return;

    e.preventDefault();
    isDragging = true;
    el.style.cursor = "grabbing";

    const rect = roomCanvas.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseFloat(el.style.left);
    startBottom = parseFloat(el.style.bottom);

    function onMouseMove(ev) {
      if (!isDragging) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const percentX = (dx / rect.width) * 100;
      const percentY = (dy / rect.height) * 100;

      el.style.left = `${startLeft + percentX}%`;
      el.style.bottom = `${startBottom - percentY}%`;
    }

    function onMouseUp() {
      isDragging = false;
      el.style.cursor = "grab";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
}

// ===== RESIZING =====
function makeResizable(wrapper, handle) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener("mousedown", e => {
    e.stopPropagation();
    e.preventDefault();
    isResizing = true;

    const rect = roomCanvas.getBoundingClientRect();
    startX = e.clientX;
    startWidth = parseFloat(wrapper.style.width);

    function onMouseMove(ev) {
      if (!isResizing) return;
      const dx = ev.clientX - startX;
      const percentX = (dx / rect.width) * 100;
      let newWidth = startWidth + percentX;

      if (newWidth < 4) newWidth = 4;   // tiny
      if (newWidth > 80) newWidth = 80; // very big

      wrapper.style.width = `${newWidth}%`;

      const entry = placedOverlays.find(p => p.el === wrapper);
      if (entry) entry.widthPercent = newWidth;
    }

    function onMouseUp() {
      isResizing = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
}

// ===== ROTATING =====
function makeRotatable(wrapper, handle) {
  let isRotating = false;

  handle.addEventListener("mousedown", e => {
    e.stopPropagation();
    e.preventDefault();
    isRotating = true;
    handle.style.cursor = "grabbing";

    function onMouseMove(ev) {
      if (!isRotating) return;

      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = ev.clientX - centerX;
      const dy = ev.clientY - centerY;

      const angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI;
      angleDeg += 90; // so 0deg faces "up"

      wrapper.dataset.angle = angleDeg.toString();

      const entry = placedOverlays.find(p => p.el === wrapper);
      if (entry) {
        entry.angle = angleDeg;
        applyTransform(entry);
      }
    }

    function onMouseUp() {
      isRotating = false;
      handle.style.cursor = "grab";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
}

// ===== SELECT =====
function makeSelectable(el) {
  el.addEventListener("click", e => {
    e.stopPropagation();
    setSelectedOverlay(el);
  });
}

if (roomCanvas) {
  roomCanvas.addEventListener("click", () => {
    setSelectedOverlay(null);
  });
}

function setSelectedOverlay(el) {
  selectedOverlay = el;
  document
    .querySelectorAll(".furniture-overlay")
    .forEach(node => node.classList.remove("selected"));
  if (el) el.classList.add("selected");
}

// ===== SUMMARY & COST =====
function updateSelectedSummary() {
  selectedList.innerHTML = "";

  if (placedOverlays.length === 0) {
    selectedList.innerHTML = "<p>No items placed yet.</p>";
    return;
  }

  const grouped = {};
  placedOverlays.forEach(entry => {
    const id = entry.item.id;
    if (!grouped[id]) grouped[id] = { item: entry.item, count: 0 };
    grouped[id].count += 1;
  });

  Object.values(grouped).forEach(group => {
    const { item, count } = group;
    const cost = item.price * count;

    const row = document.createElement("div");
    row.className = "selected-row";

    const label = document.createElement("span");
    label.textContent = `${item.name} × ${count}`;

    const price = document.createElement("span");
    price.textContent = "₹" + cost;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeItem(item.id));

    row.appendChild(label);
    row.appendChild(price);
    row.appendChild(removeBtn);
    selectedList.appendChild(row);
  });
}

function removeItem(itemId) {
  placedOverlays.forEach(entry => {
    if (entry.item.id === itemId) entry.el.remove();
  });
  placedOverlays = placedOverlays.filter(entry => entry.item.id !== itemId);
  if (selectedOverlay && !placedOverlays.find(p => p.el === selectedOverlay)) {
    selectedOverlay = null;
  }
  updateSelectedSummary();
  updateCosts();
}

// COST: furniture + wall + labour
function updateCosts() {
  let furnitureCost = 0;
  placedOverlays.forEach(entry => {
    furnitureCost += entry.item.price;
  });

  const wallCost = selectedWall ? selectedWall.cost : 0;

  const materialCost = furnitureCost + wallCost;
  const labour = Math.round(materialCost * 0.2);
  const total = materialCost + labour;

  furnitureCostSpan.textContent = furnitureCost;
  wallCostSpan.textContent = wallCost;
  labourCostSpan.textContent = labour;
  totalCostSpan.textContent = total;
}

// ===== CLEAR / RESET =====
function clearAllFurniture() {
  placedOverlays.forEach(entry => entry.el.remove());
  placedOverlays = [];
  selectedOverlay = null;
  updateSelectedSummary();
  updateCosts();
}

// ===== TOOLBAR BUTTONS =====
if (btnRedesign) {
  btnRedesign.addEventListener("click", () => {
    clearAllFurniture();
    alert("Design reset. Add new furniture from the right panel.");
  });
}

if (btnCenterCamera) {
  btnCenterCamera.addEventListener("click", () => {
    placedOverlays.forEach(entry => {
      entry.el.style.left = "40%";
    });
  });
}

if (btnDownload) {
  btnDownload.addEventListener("click", () => {
    alert(
      "Download is a demo here. In a full version this would export your design as image/PDF."
    );
  });
}

if (btnZoomIn) {
  btnZoomIn.addEventListener("click", () => {
    alert("To resize furniture, drag the blue circle at its corner.");
  });
}

if (btnZoomOut) {
  btnZoomOut.addEventListener("click", () => {
    alert("To resize furniture, drag the blue circle at its corner.");
  });
}

if (btnClear) {
  btnClear.addEventListener("click", () => {
    clearAllFurniture();
  });
}

// ===== MIRROR BUTTON (⇋) =====
if (btnMirror) {
  btnMirror.addEventListener("click", () => {
    if (!selectedOverlay) {
      alert("Select a furniture item first, then click Mirror (⇋).");
      return;
    }

    const entry = placedOverlays.find(p => p.el === selectedOverlay);
    if (!entry) return;

    entry.mirrored = !entry.mirrored;
    applyTransform(entry);
  });
}

// simple info buttons (optional)
if (btnMore) {
  btnMore.addEventListener("click", () => {
    alert("Future: save design, export AR view, share with contractor.");
  });
}
if (btnPrevDesign) {
  btnPrevDesign.addEventListener("click", () => {
    alert("Previous design (demo only).");
  });
}
if (btnNextDesign) {
  btnNextDesign.addEventListener("click", () => {
    alert("Next design (demo only).");
  });
}
if (linkMyDesigns) {
  linkMyDesigns.addEventListener("click", e => {
    e.preventDefault();
    const furnitureCount = placedOverlays.length;
    alert(
      `My Designs (demo)\n\nItems placed: ${furnitureCount}\nTotal cost: ₹${totalCostSpan.textContent}`
    );
  });
}
if (linkHelp) {
  linkHelp.addEventListener("click", e => {
    e.preventDefault();
    alert(
      "Help:\n1) Upload room image\n2) Pick wall colour\n3) Add furniture from right\n4) Drag to move\n5) Drag blue circle to resize\n6) Drag green circle to rotate\n7) Click ⇋ to mirror."
    );
  });
}
if (linkUser) {
  linkUser.addEventListener("click", e => {
    e.preventDefault();
    alert("User account (demo only).");
  });
}

// ===== ROOM TYPE & CATEGORY CHANGES =====
if (roomTypeSelect) {
  roomTypeSelect.addEventListener("change", () => {
    clearAllFurniture();
    renderProducts();
  });
}

if (productCategorySelect) {
  productCategorySelect.addEventListener("change", () => {
    renderProducts();
  });
}

// ===== INIT =====
renderWallOptions();
renderProducts();
updateSelectedSummary();
updateCosts();

