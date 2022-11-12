const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  Key: {
    type: String,
    required: true,
  },

  Translation: [
    {
      language: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
});

module.exports = Translation = mongoose.model(
  "translations",
  translationSchema
);
