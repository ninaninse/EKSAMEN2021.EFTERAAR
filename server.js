const express = require("express");
const app = express();

// Controllers angivet nedenfor for både user og item
const userController = require("./src/controllers/user-controller");
const itemController = require("./src/controllers/item-controller");

const PORT = process.env.PORT || 3000;

// Middleware 
app.use(express.static("./src/views"));
// Kommer som string -> JSON
app.use(express.json());

// Routes angivet nedenfor for både user og item
app.use("/", userController);
app.use("/", itemController);

// Herved startes serveren
app.listen(PORT, console.log("Server is running"));
