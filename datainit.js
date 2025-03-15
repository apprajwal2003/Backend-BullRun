const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const { HoldingsModel } = require("./models/HoldingModel");
const { PositionsModel } = require("./models/PositionsModel");
const { holdings, positions } = require("../dashboard/src/data/data.js");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected!");

    // Delete all existing holdings and positions
    const deleteHoldings = HoldingsModel.deleteMany({});
    const deletePositions = PositionsModel.deleteMany({});

    Promise.all([deleteHoldings, deletePositions])
      .then(() => {
        console.log("All existing holdings and positions deleted!");

        // Save all holdings data
        const saveHoldings = holdings.map((item) => {
          const holding = new HoldingsModel({
            name: item.name,
            qty: item.qty,
            avg: item.avg,
            price: item.price,
            net: item.net,
            day: item.day,
          });

          return holding
            .save()
            .then(() => {
              console.log(`Saved holding: ${item.name}`);
            })
            .catch((error) => {
              console.error(`Error saving holding: ${item.name}`, error);
            });
        });

        // Save all positions data
        const savePositions = positions.map((item) => {
          const position = new PositionsModel({
            product: item.product,
            name: item.name,
            qty: item.qty,
            avg: item.avg,
            price: item.price,
            net: item.net,
            day: item.day,
            isLoss: item.isLoss,
          });

          return position
            .save()
            .then(() => {
              console.log(`Saved position: ${item.name}`);
            })
            .catch((error) => {
              console.error(`Error saving position: ${item.name}`, error);
            });
        });

        Promise.all([...saveHoldings, ...savePositions])
          .then(() => {
            console.log("All holdings and positions saved!");
            mongoose.disconnect();
            process.exit(0);
          })
          .catch((error) => {
            console.error("Error saving holdings or positions:", error);
            mongoose.disconnect();
            process.exit(1);
          });
      })
      .catch((error) => {
        console.error("Error deleting existing holdings or positions:", error);
        mongoose.disconnect();
        process.exit(1);
      });
  })
  .catch((error) => {
    console.error("DB connection error:", error);
    process.exit(1);
  });
