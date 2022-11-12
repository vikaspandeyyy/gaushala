const mongoose = require("mongoose");

const importerSchema = new mongoose.Schema(
  {
    CSVFile: {
      type: String,
      required: true,
    },
    ImportType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Importer = mongoose.model("importer", importerSchema);
