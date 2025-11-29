// WALL COLOUR OPTIONS WITH COST
const WALL_OPTIONS = [
  { id: "wall_white", label: "Soft White", color: "#f5f5f5", cost: 15000 },
  { id: "wall_beige", label: "Warm Beige", color: "#f3e2c5", cost: 17000 },
  { id: "wall_grey",  label: "Cool Grey",  color: "#d3d7dd", cost: 16000 },
  { id: "wall_olive", label: "Olive Accent", color: "#a2ad7e", cost: 18000 },
  { id: "wall_blue",  label: "Muted Blue", color: "#c3d9f5", cost: 16500 }
];

// FURNITURE CATALOGUE – keep using local images or URLs
const PRODUCTS = [
  // Living – Sofas
  {
    id: "lv_sofa1",
    roomType: "living",
    category: "sofa",
    name: "3-Seater Sofa",
    price: 25000,
    image: "images/sofa1.png"
  },
  {
    id: "lv_sofa2",
    roomType: "living",
    category: "sofa",
    name: "Fabric L-Shaped Sofa",
    price: 34000,
    image: "images/sofa2.png"
  },
  {
    id: "lv_sofa3",
    roomType: "living",
    category: "sofa",
    name: "Minimal 2-Seater Sofa",
    price: 19000,
    image: "images/sofa3.png"
  },

  // Living – Chairs
  {
    id: "lv_chair1",
    roomType: "living",
    category: "chair",
    name: "Accent Armchair",
    price: 12000,
    image: "images/chair1.png"
  },
  {
    id: "lv_chair2",
    roomType: "living",
    category: "chair",
    name: "Reading Chair",
    price: 11000,
    image: "images/chair2.png"
  },

  // Living – Tables
  {
    id: "lv_table1",
    roomType: "living",
    category: "table",
    name: "Coffee Table",
    price: 6000,
    image: "images/table1.png"
  },
  {
    id: "lv_table2",
    roomType: "living",
    category: "table",
    name: "Side Table",
    price: 4000,
    image: "images/table2.png"
  },

  // Living – Storage / TV
  {
    id: "lv_tv1",
    roomType: "living",
    category: "storage",
    name: "TV Unit",
    price: 15000,
    image: "images/tv1.png"
  },

  // Living – Lighting
  {
    id: "lv_lamp1",
    roomType: "living",
    category: "lighting",
    name: "Floor Lamp",
    price: 4000,
    image: "images/lamp1.png"
  },
  {
    id: "lv_lamp2",
    roomType: "living",
    category: "lighting",
    name: "Tripod Lamp",
    price: 5500,
    image: "images/lamp2.png"
  },

  // Bedroom
  {
    id: "bd_bed1",
    roomType: "bedroom",
    category: "sofa",
    name: "Queen Bed",
    price: 28000,
    image: "images/bed1.png"
  },
  {
    id: "bd_side1",
    roomType: "bedroom",
    category: "table",
    name: "Bedside Table",
    price: 5000,
    image: "images/bedside.png"
  },
  {
    id: "bd_wardrobe1",
    roomType: "bedroom",
    category: "storage",
    name: "Wardrobe",
    price: 22000,
    image: "images/wardrobe1.png"
  },

  // Kitchen
  {
    id: "kt_cabinets",
    roomType: "kitchen",
    category: "storage",
    name: "Modular Cabinets",
    price: 35000,
    image: "images/cabinets.png"
  },
  {
    id: "kt_island",
    roomType: "kitchen",
    category: "table",
    name: "Kitchen Island",
    price: 25000,
    image: "images/island.png"
  },

  // Bathroom
  {
    id: "bt_vanity",
    roomType: "bathroom",
    category: "storage",
    name: "Vanity Unit",
    price: 20000,
    image: "images/vanity.png"
  },
  {
    id: "bt_vanity",
    roomType: "bathroom",
    category: "Bathtub",
    name: "Vanity Unit",
    price: 20000,
    image: "images/bathtub.png"
  },
  {
    id: "bt_shower",
    roomType: "bathroom",
    category: "storage",
    name: "Shower Enclosure",
    price: 25000,
    image: "images/shower.png"
  }
];
