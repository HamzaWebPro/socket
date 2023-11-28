const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const app = express();

// Allow requests from the specific frontend domain
const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

mongoose
  .connect(
    "mongodb+srv://socket:socket@app.tzveal3.mongodb.net/socket-crud?retryWrites=true&w=majority"
  )
  .then(() => console.log("db connected"));

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

const server = app.listen(8000, function () {
  console.log("port running");
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("socket new client connected");
  socket.emit("connected", "soxket.io connected from backend");

  socket.on("create", async (data) => {
    try {
      console.log(data, "create Data");
      const newItem = new Item(data);
      await newItem.save();
      io.emit("created", newItem);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("read", async (data) => {
    try {
      console.log(data, "read Data");
      const items = await Item.find({}); // Make sure to await the query
  
      socket.emit("read", items); // Emit "read" event instead of "created"
    } catch (err) {
      console.log(err);
    }
  });
});
