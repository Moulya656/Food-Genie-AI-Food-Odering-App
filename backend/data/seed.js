const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../.env" });

const connectDB = require("../config/db");
const Cook = require("../models/Cook");
const MenuItem = require("../models/MenuItem");
const Coupon = require("../models/Coupon");

const cooksData = require("./cooks.json");
const menuItemsData = require("./menuItems.json");
const couponsData = require("./coupons.json");

const generateDescription = (item, cuisineType) => {
  const spicePhrase = { mild: "gently spiced", medium: "warmly spiced", spicy: "fired up with a bold, spicy kick" };
  const dietPhrase = { veg: "a comforting vegetarian favorite", nonveg: "a hearty, protein-packed classic", vegan: "a wholesome plant-based dish" };
  const tagLine = item.tags?.length ? ` Notes of ${item.tags.slice(0, 3).join(", ")}.` : "";
  return `${item.name} — ${dietPhrase[item.dietType] || dietPhrase.veg}, made ${cuisineType} style and ${spicePhrase[item.spiceLevel] || spicePhrase.medium}, prepared fresh the way it's done at home.${tagLine}`;
};

const seedDatabase = async () => {
  await connectDB();

  await Cook.deleteMany();
  await MenuItem.deleteMany();
  await Coupon.deleteMany();

  const insertedCooks = await Cook.insertMany(cooksData);
  console.log(`Seeded ${insertedCooks.length} kitchens`);

  const cookIdByName = {};
  insertedCooks.forEach((c) => (cookIdByName[c.kitchenName] = { id: c._id, cuisine: c.cuisineTypes[0] }));

  const menuItemsWithCook = menuItemsData
    .map((item) => {
      const cookInfo = cookIdByName[item.kitchenName];
      if (!cookInfo) {
        console.warn(
          `⚠️  Skipping "${item.name}" — no kitchen found matching kitchenName "${item.kitchenName}". ` +
          `Check spelling/capitalization against cooks.json.`
        );
        return null;
      }
      const { kitchenName, ...rest } = item;
      return {
        ...rest,
        cook: cookInfo.id,
        description: item.description || generateDescription(item, cookInfo.cuisine),
      };
    })
    .filter(Boolean);

  const insertedItems = await MenuItem.insertMany(menuItemsWithCook);
  console.log(`Seeded ${insertedItems.length} menu items`);

  const insertedCoupons = await Coupon.insertMany(couponsData);
  console.log(`Seeded ${insertedCoupons.length} coupons`);

  console.log("Seeding complete.");
  process.exit();
};

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
