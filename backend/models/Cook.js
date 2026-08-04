const mongoose = require("mongoose");

const cookSchema = new mongoose.Schema(
  {
    kitchenName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true },
    story: { type: String, default: "" },
    cuisineTypes: [{ type: String }],
    region: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, default: "/images/kitchen-default.jpg" },
    imageCategory: { type: String, default: "dosa" },
    servesNonVeg: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    avgPrepTimeMins: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 20 },
    minOrderValue: { type: Number, default: 99 },
    isOpen: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

cookSchema.index({ kitchenName: "text", region: "text", city: "text", cuisineTypes: "text" });

module.exports = mongoose.model("Cook", cookSchema);
