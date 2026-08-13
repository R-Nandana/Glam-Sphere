const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

// Read sampleProducts from frontend
const sampleDataPath = path.join(__dirname, "../frontend/src/data/sampleProducts.js");
let content = fs.readFileSync(sampleDataPath, "utf-8");

// Convert ES6 export to CommonJS to evaluate
content = content.replace("export default sampleProducts;", "module.exports = sampleProducts;");

// Create a temp file to require it
const tempPath = path.join(__dirname, "tempSampleData.js");
fs.writeFileSync(tempPath, content);
const sampleProducts = require("./tempSampleData");
fs.unlinkSync(tempPath); // cleanup

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Clearing existing products...");
    await Product.deleteMany();
    
    // Remove _id from sampleProducts so MongoDB generates new ones, or keep them if they are valid ObjectIds
    // sampleProducts _ids are like "sample1", which are not valid ObjectIds, so we remove them
    const productsToInsert = sampleProducts.map(({ _id, skinTypes, ...rest }) => {
      let mappedSkinTypes = skinTypes;
      if (skinTypes && skinTypes.includes("All")) {
        mappedSkinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
      }
      return { ...rest, skinTypes: mappedSkinTypes };
    });
    
    console.log(`Inserting ${productsToInsert.length} products...`);
    await Product.insertMany(productsToInsert);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedProducts();
