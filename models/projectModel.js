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
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
  },
});
module.exports = mongoose.model("Project", ProjectSchema);
