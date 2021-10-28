const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./src/routes");
const port = process.env.PORT || 4000;
var path = require("path");
// test PR
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/app/v1/techartsy", router);
app.use("/uploads", express.static("uploads"));
app.get("/", (err, res) => {
  res.send("Server Run");
});

app.listen(port, () => console.log(`Server Starts on ${port}!`));
