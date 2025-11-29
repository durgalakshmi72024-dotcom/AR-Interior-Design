// Wall paint / texture options
const WALL_PRESETS = [
  { id: "wall_soft_white", label: "Soft White", color: "#f5f5f5" },
  { id: "wall_warm_beige", label: "Warm Beige", color: "#f3e2c5" },
  { id: "wall_cool_grey", label: "Cool Grey", color: "#d3d7dd" },
  { id: "wall_olive", label: "Olive Accent", color: "#a2ad7e" }
];

// Flooring options (using texture images from web)
const FLOOR_PRESETS = [
  {
    id: "floor_wood",
    label: "Warm Wood",
    image:
      "https://images.pexels.com/photos/37347/wood-floor-flooring-floors.jpg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "floor_light_tile",
    label: "Light Tile",
    image:
      "https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "floor_dark_tile",
    label: "Dark Tile",
    image:
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

// Lighting moods
const LIGHT_PRESETS = [
  { id: "light_none", label: "Normal", type: "none" },
  { id: "light_warm", label: "Warm Evening", type: "warm" },
  { id: "light_cool", label: "Cool Daylight", type: "cool" },
  { id: "light_moody", label: "Moody", type: "moody" }
];

// Furniture sets per room type
const FURNITURE_SETS = [
  {
    id: "living_modern",
    label: "Living · Modern Set",
    roomType: "living",
    items: [
      { name: "3-Seater Sofa", price: 25000 },
      { name: "Coffee Table", price: 6000 },
      { name: "TV Unit", price: 12000 }
    ],
    overlays: [
      {
        image:
          "https://pngimg.com/uploads/sofa/sofa_PNG6985.png",
        left: "12%",
        bottom: "6%"
      },
      {
        image:
          "https://pngimg.com/uploads/table/table_PNG7014.png",
        left: "44%",
        bottom: "6%"
      },
      {
        image:
          "https://pngimg.com/uploads/tv_stand/tv_stand_PNG62.png",
        left: "75%",
        bottom: "12%"
      }
    ]
  },
  {
    id: "bedroom_cozy",
    label: "Bedroom · Cozy Set",
    roomType: "bedroom",
    items: [
      { name: "Queen Bed", price: 28000 },
      { name: "Side Tables (x2)", price: 8000 },
      { name: "Wardrobe", price: 22000 }
    ],
    overlays: [
      {
        image:
          "https://pngimg.com/uploads/bed/bed_PNG17486.png",
        left: "50%",
        bottom: "5%"
      }
    ]
  },
  {
    id: "kitchen_linear",
    label: "Kitchen · Linear Cabinets",
    roomType: "kitchen",
    items: [
      { name: "Base Cabinets", price: 35000 },
      { name: "Overhead Cabinets", price: 25000 },
      { name: "Quartz Countertop", price: 30000 }
    ],
    overlays: [
      {
        image:
          "https://pngimg.com/uploads/kitchen/kitchen_PNG17058.png",
        left: "50%",
        bottom: "5%"
      }
    ]
  },
  {
    id: "bathroom_spa",
    label: "Bathroom · Spa Style",
    roomType: "bathroom",
    items: [
      { name: "Vanity Unit", price: 20000 },
      { name: "Glass Shower Enclosure", price: 25000 },
      { name: "Wall Tiles", price: 18000 }
    ],
    overlays: [
      {
        image:
          "https://pngimg.com/uploads/bathroom/bathroom_PNG17430.png",
        left: "50%",
        bottom: "5%"
      }
    ]
  }
];
