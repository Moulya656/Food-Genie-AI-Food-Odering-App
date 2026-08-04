const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "Cook", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks", "tiffin-combo"],
      default: "lunch",
    },
    dietType: { type: String, enum: ["veg", "nonveg", "vegan"], default: "veg" },
    spiceLevel: { type: String, enum: ["mild", "medium", "spicy"], default: "medium" },
    tags: [{ type: String }],
    image: { type: String, default: "/images/dish-default.svg" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
