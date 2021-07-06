const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config();

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.listen(8080, () => {
  console.log("Running on port 8080...");
});
