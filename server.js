const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./src/routes");
const port = process.env.PORT || 4000;
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use("/uploads", express.static("uploads"));
// app.use(express.static("../uploads"));
app.use(express.static(path.join(__dirname, "public")));
// process.env.PWD = process.cwd();
// app.use(express.static(path.join(process.env.PWD, "public")));
// app.use('/static', express.static(__dirname + '/public'));
// app.use(express.static(__dirname + "../public"));
app.use("/app/v1/techartsy", router);
app.get("/", (err, res) => {
  res.send("Server Run");
});

app.listen(port, () => console.log(`Server Starts on ${port}!`));
