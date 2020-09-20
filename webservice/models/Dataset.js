const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Dataset Schema
const DatasetSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  labels: [{
    name: {
      type: String,
      required: true
    }
  }],
  docs: [{
    text: {
      type: String,
      required: true
    },
    ents: [{
      start: {
        type: Number,
        required: true
      },
      end: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        required: true
      }
    }],
    confidence: {
      type: Number,
      required: true
    },
  }],
  ready: [],
  trained: [],
  test: []
});

module.exports = Dataset = mongoose.model("dataset", DatasetSchema);