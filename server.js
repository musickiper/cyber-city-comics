const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

// DB Connection for counting views
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error(e);
  });

const { Schema } = mongoose;

const StripSchema = new Schema({
  stripId: String,
  viewCount: Number,
});

const Strip = mongoose.model("Strip", StripSchema);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Router only for view counting
app.put("/strip/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let strip = await Strip.findOne({ stripId: id }).exec();
    if (!strip) {
      strip = new Strip({
        stripId: id,
        viewCount: 1,
      });
      await strip.save();
    } else {
      const newViewCount = strip.viewCount + 1;
      strip = await Strip.findByIdAndUpdate(
        strip._id,
        {
          viewCount: parseInt(newViewCount),
        },
        { new: true }
      ).exec();
    }
    res.send(strip);
  } catch (e) {
    console.error(e);
  }
});

// Default routing
app.use((req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

const port = PORT || 4000;

app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
