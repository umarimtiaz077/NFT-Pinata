// models/UserQuery.js
const mongoose = require("mongoose");

const userQuerySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserQuery = mongoose.model("UserQuery", userQuerySchema);

module.exports = UserQuery;
