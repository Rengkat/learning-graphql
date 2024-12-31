const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: pending,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
  },
});
