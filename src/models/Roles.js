const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    "Name": {
        type: String,
        required: true,
    },
    "Created": {
        type: String,
        required: true,

    },

    "Permissions": [{
        "name": {
            type: String
        },
        "value": {
            type: String
        }
    }],

});

module.exports = Role = mongoose.model("roles", roleSchema);